
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { JsonSchemaFormModule } from 'src/assets/ajsf-10.0.0/ajsf-core/src/public_api';
import { TeepeeFrameworkModule } from '../../teepee-framework/teepee-framework.module';
import { TeepeeFormComponent } from './teepee-form.component';

@NgModule({
  declarations: [TeepeeFormComponent],
  imports: [JsonSchemaFormModule, CommonModule, TeepeeFrameworkModule],
  exports: [TeepeeFormComponent],
})
export class TeepeeFormModule {}
