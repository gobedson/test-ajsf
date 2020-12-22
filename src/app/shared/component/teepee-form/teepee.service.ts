import { Injectable } from "@angular/core";
import { each } from 'lodash';

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

@Injectable({
  providedIn: 'root'
})
export class TeepeeService {
  public computeForm(schema: unknown, form: any[], model: { [key: string]: unknown; }): {
    schema: any;
    form: any;
    model: any;
  } {
    let newSchema: unknown;
    let newForm: any[];
    let newModel: unknown;

    const conditionalFields = form
      .filter((field) => field.querybuildercontent.rules && field.querybuildercontent.rules.length > 0)
      .reduce((objField, curr) => ({
        ...objField,
        [curr.key]: curr.querybuildercontent
      }), {});

    if (Object.entries(conditionalFields).length === 0) {
      return {
        schema,
        form,
        model
      };
    }

    newSchema = this.deepClone(schema);
    newForm = this.deepClone(form);
    newModel = this.deepClone(model);

    const dataMapped = new Map(Object.entries(model));

    each(conditionalFields, (conditionSchema: IGroup, dependOn: string) => {
      const isVisible = eval(this.computeConditions(conditionSchema, dependOn, dataMapped));
        newForm = newForm.map((field) => {
          if (field.key === dependOn) {
            return {
              ...field,
              visible: isVisible
            };
          }

          return field;
        });
    });


    return {
      schema: newSchema,
      form: newForm,
      model: newModel
    };
  }

  private computeConditions(conditionSchema: IGroup, dependOn: string, dataMapped: Map<string, unknown>): string {
    let conditions: unknown[] = this.checkConditions(conditionSchema.rules, dependOn, dataMapped);
    conditions.splice(1, 0, conditionSchema.operator);
    return conditions.join('');
  }

  private checkConditions(rules: IGroup | ISimpleRule[], dependOn: string, dataMapped: Map<string, unknown>): unknown[] {
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
    if (obj1 === undefined) { obj1 = ''; }
    if (obj2 === undefined) { obj2 = ''; }

    if (rule.condition === CONDITIONS.equal) {
      return obj1 === obj2;
    }

    if (rule.condition === CONDITIONS.different) {
      return obj1 !== obj2;
    }
  }

  private deepClone(objectToClone: Object): any {
    return JSON.parse(JSON.stringify(objectToClone));
  }
}
