import { Component, Input, OnDestroy, OnInit } from "@angular/core";


@Component({
  selector: 'app-teepee-form',
  templateUrl: './teepee-form.component.html',
})
export class TeepeeFormComponent implements OnInit, OnDestroy {

  @Input() model: any;

  @Input() form: any;

  @Input() schema: any;

  jsonFormOptions = {
    addSubmit: false, // Add a submit button if layout does not have one
    debug: false, // Don't show inline debugging information
    loadExternalAssets: true, // Load external css and JavaScript for frameworks
    defautWidgetOptions: {
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

  constructor() {}

  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }


}
