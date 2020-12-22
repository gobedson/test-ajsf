import { Component, Input, ViewChild } from "@angular/core";
import { JsonSchemaFormService } from "src/assets/ajsf-10.0.0/ajsf-core/src/public_api";
import { TeepeeService } from "./teepee.service";

@Component({
  selector: 'app-teepee-form',
  templateUrl: './teepee-form.component.html',
})
export class TeepeeFormComponent {
  @Input() model: any = {};
  @Input() form: any;
  @Input() schema: any;
  @ViewChild('myForm')
  public myForm;

  public data = {
    schema: null,
    form: null,
    model: null,
  };
  public newModel;
  public newForm;
  public newSchema;

  jsonFormOptions = {
    addSubmit: false, // Add a submit button if layout does not have one
    debug: false, // Don't show inline debugging information
    loadExternalAssets: true, // Load external css and JavaScript for frameworks
    defautWidgetOptions: {
      visible: true,
      feedback: true,
      validationMessages: {
        required: 'Champs requis!',
        test(error) {
          if ((1 / error.multipleOfValue) % 10 === 0) {
            const decimals = Math.log10(1 / error.multipleOfValue);
            return `Must have ${decimals} or fewer decimal places.`;
          }
          return `Must be a multiple of ${error.multipleOfValue}.`;
        },
      },
    }, // Show inline feedback icons
  };

  constructor(
    private readonly teepeeService: TeepeeService,
    private readonly jsf: JsonSchemaFormService,
  ) {}
  
  public ngOnInit(): void {
    this.data = this.teepeeService.computeForm(this.schema, this.form, this.model);
  }

  public valuesChanged(values: { [key: string]: unknown }) {
    if (this.myForm) {
      const computedFields = this.teepeeService.computeForm(this.schema, this.form, values);
      this.jsf.layout = this.jsf.layout.map((layout) => {
        const computedField = computedFields.form.find((field: any) => field.key === layout.name);
        if (computedField) {
          return {
            ...layout,
            options: {
              ...layout.options,
              visible: computedField.hasOwnProperty('visible') ? computedField.visible : true
            }
          }
        }

        return layout;
      });
    }
  }
} 
