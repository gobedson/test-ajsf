import { Directive, Inject, Input, NgZone, OnDestroy, OnInit, Optional } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { JsonSchemaFormService } from 'src/assets/ajsf-10.0.0/ajsf-core/src/public_api';

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

  rules: any[];

  subToDestroy: Subscription[] = [];

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
    @Inject(MAT_LABEL_GLOBAL_OPTIONS)
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

    this.options.querybuildercontent?.rules.forEach((rule) => {
      if (rule.obj1selected) {
        this.rules.push(rule.obj1selected.value);
      }
    });
    this.type = this.options.typeFormat ? this.options.typeFormat : this.layoutNode.type;
    this.refreshVisibility();

    if (
      (this.layoutNode.type as string).toLowerCase() ===
      (this.options?.title as string)?.toLowerCase()
    ) {
      this.options.title = '';
    }

    this.jsf.updateValue(this, this.controlValue);
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
