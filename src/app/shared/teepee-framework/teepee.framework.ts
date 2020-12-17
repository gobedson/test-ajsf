import { Injectable } from '@angular/core';
import { Framework } from 'src/assets/ajsf-10.0.0/ajsf-core/src/public_api';
import { InputComponent } from '../widgets/input/input.component';
import { TeepeeFrameworkComponent } from './teepee-framework.component';

@Injectable()
export class TeepeeFramework extends Framework {
  name = 'teepee';
  framework = TeepeeFrameworkComponent;

  widgets = {
    string: InputComponent,
    text: InputComponent,
    password: InputComponent,
    input: InputComponent,
  };
}
