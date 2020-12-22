import { Component, Inject, NgZone, Optional } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { JsonSchemaFormService } from 'src/assets/ajsf-10.0.0/ajsf-core/src/public_api';
import { TeepeeComponent } from '../../teepeeComponent';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent extends TeepeeComponent {
  id: string;

  inputUpdate = new Subject<string>();

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
    super(
      matFormFieldDefaultOptions,
      matLabelGlobalOptions,
      _ngZone,
      jsf,
    );
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    super.ngOnInit();

    // eslint-disable-next-line no-underscore-dangle
    this.id = `controltext${this.layoutNode?._id}`;
    this.type = this.options.typeFormat ? this.options.typeFormat : this.layoutNode.type;
    this.inputUpdate.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((value) => {
      this.updateValue(value);
    });
  }
}
