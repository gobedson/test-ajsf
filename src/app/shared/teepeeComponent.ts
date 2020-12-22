import { Directive, Inject, Input, NgZone, OnDestroy, OnInit, Optional } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { Observable, of, Subscription } from 'rxjs';
import { JsonSchemaFormService } from 'src/assets/ajsf-10.0.0/ajsf-core/src/public_api';
import { each } from 'lodash';
import { debounceTime, distinctUntilChanged, map, skip, tap } from 'rxjs/operators';

enum OBJECT_RULE_TYPES {
    property = 'property',
    constance = 'constance'
}
  
enum RULE_TYPES {
    SimpleRule = 'SimpleRule',
    Group = 'Group',
}

enum OPERATORS {
  or = '||',
  and = '&&'
}

enum CONDITIONS {
  greaterThan = '>',
  equalOrGreaterThan = '>=',
  lessThan = '<',
  equalOrLessThan = '<=',
  equal = '==',
  different = '!='
}

interface IPropertyField {
  format: string;
  is: string;
  name: string;
  type: OBJECT_RULE_TYPES;
  value: unknown;
}

interface IConstanceField {
  constance: unknown;
  name: string;
  type: OBJECT_RULE_TYPES;
  value: unknown;
}

export type Field = IPropertyField | IConstanceField;

interface ISimpleRule {
  condition: CONDITIONS;
  obj1selected: Field;
  obj2selected: Field;
  type: RULE_TYPES;
}

interface IGroup {
  type: RULE_TYPES;
  rules?: ISimpleRule[];
  operator?: OPERATORS;
}
@Directive()
export class TeepeeComponent implements OnInit, OnDestroy {

  formControl: AbstractControl;

  formArray: AbstractControl;

  controlName: string;



  private p_controlValue: any;

  set controlValue(val) {
    this.p_controlValue = val;
  }

  get controlValue(): any {
    return this.p_controlValue;
  }

  controlDisabled = false;

  boundControl = true;

  options: any;

  autoCompleteList: string[] = [];

  @Input() layoutNode: any;

  @Input() layoutIndex: number[];

  @Input() dataIndex: number[];

  @Input() form : any;

  @Input() model : any;

  subscription: Subscription;

  value: any;

  visibility: boolean;

  type: any;

  rules: any;

  subToDestroy: Subscription[] = [];

  public isVisible$: Observable<boolean> = of(false);

  // initResult: any;

  get componentName(): string {
    if (!!this.layoutNode && !!this.layoutNode.dataPointer) {
      let name = this.layoutNode.dataPointer.split('/').join('');
      name = name.split('-').join('[].');
      return name;
    }
    return null;
  }

  constructor(
    @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS)
    @Optional()
    public matFormFieldDefaultOptions,
    @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS)
    @Optional()
    public matLabelGlobalOptions,
    protected readonly _ngZone: NgZone,
    protected readonly jsf: JsonSchemaFormService,
  ) {
    this.rules = [];
  }

  getArrayParentNodeName(node: any): string {
    return node.dataPointer?.replaceAll('/', '').replaceAll('-', '');
  }

  ngOnInit(): void {
    this.options = this.layoutNode.options || {};

    this.jsf.initializeControl(this);

    if (!this.options.notitle && !this.options.description && this.options.placeholder) {
      this.options.description = this.options.placeholder;
    }

    if (this.options.querybuildercontent.rules.length > 0) {
      this.rules = this.options.querybuildercontent.rules.map((rule) => {
        return rule;
      });
    }

    this.type = this.options.typeFormat ? this.options.typeFormat : this.layoutNode.type;

    this.isVisible$ = this.jsf.formGroup.valueChanges.pipe(
      // Can use debounceTime
      // Can use distinctUntilChanged
      map((values) => {
        const dataMapped: Map<string, unknown> = new Map(Object.entries(values));

        if (this.rules.length > 0 && this.options.typeFormat === 'string') {
          const condition: string = this.computeConditions(this.options.querybuildercontent, this.options.name, dataMapped);
          return eval(condition);
        }

        if (this.rules.length > 0 && this.options.typeFormat === 'array') {
          // type Array
        }

        return true;
      })
    );
  }

  private computeConditions(querybuildercontent: IGroup, dependOn: string, dataMapped: Map<string, unknown>): string {
    let conditions: unknown[] = this.checkOperator(querybuildercontent.rules, dependOn, dataMapped);
    conditions.splice(1, 0, querybuildercontent.operator);
    return conditions.join('');
  }

  private checkOperator(rules: IGroup | ISimpleRule[], dependOn: string, dataMapped: Map<string, unknown>): unknown[] {
    return (rules as ISimpleRule[]).map((rule: ISimpleRule) => {
      if (rule.type === RULE_TYPES.SimpleRule) {
        return this.checkCondition(rule, dataMapped);
      }

      if (rule.type === RULE_TYPES.Group) {
        return this.computeConditions(rule, dependOn, dataMapped);
      }
    })
  }

  private checkCondition(rule: ISimpleRule, dataMapped: Map<string, unknown>): boolean {
    let obj1: unknown = rule.obj1selected.type === OBJECT_RULE_TYPES.property ? dataMapped.get(rule.obj1selected.name) : rule.obj1selected[OBJECT_RULE_TYPES.constance];
    let obj2: unknown = rule.obj2selected.type === OBJECT_RULE_TYPES.property ? dataMapped.get(rule.obj2selected.name) : rule.obj2selected[OBJECT_RULE_TYPES.constance];

    // If model is an empty object it will return 'undefined' and break the logic
    if (obj1 === null) { obj1 = ''; }
    if (obj2 === null) { obj2 = ''; }

    if (rule.condition === CONDITIONS.equal) {
      return obj1 === obj2;
    }

    if (rule.condition === CONDITIONS.different) {
      return obj1 !== obj2;
    }
  }

  ngOnDestroy(): void {
    this.subToDestroy.forEach((sub) => sub.unsubscribe());
  }

  updateValue(value) {
    this.jsf.updateValue(this, value);
    this.updateModel(this.jsf.getParentNode(this));
  }

  init(): void {}

  refreshVisibility() {
    this.jsf.evaluateCondition(this.layoutNode, this.dataIndex);
  }

  get title() {
    return this.options?.title || '';
  }

  get placeHolder() {
    return this.options?.placeholder || '';
  }

  updateModel(parent): any {

    if (parent.arrayItem === true || parent.type === 'array') {
      const arrayIndex = this.layoutIndex[0];
      const rowIndex = this.layoutIndex[1];
      const { key } = this.form[arrayIndex];
      const controleName = this.controlName;

      if (!this.model[key]) {
        this.model[key] = [];
        this.model[key][rowIndex] = {};
      }
      if (!this.model[key][rowIndex]) {
        this.model[key][rowIndex] = {};
      }
      this.model[key][rowIndex][controleName] = this.controlValue;
    } else {
      this.model[this.controlName] = this.controlValue;
    }
  }
}
