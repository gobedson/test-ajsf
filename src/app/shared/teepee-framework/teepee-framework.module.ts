
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
// material.module.ts
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Framework, FrameworkLibraryService, JsonSchemaFormModule, JsonSchemaFormService, WidgetLibraryModule, WidgetLibraryService } from 'src/assets/ajsf-10.0.0/ajsf-core/src/public_api';
import { fixAngularFlex } from 'src/assets/ajsf-10.0.0/ajsf-material/src/lib/angular-flex-monkey-patch';
import { TeepeeFramework } from './teepee.framework';

export const ANGULAR_MATERIAL_MODULES = [
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ANGULAR_MATERIAL_MODULES,
    ScrollingModule,
    WidgetLibraryModule,
    JsonSchemaFormModule,
  ],
  declarations: [],
  exports: [...ANGULAR_MATERIAL_MODULES],
  providers: [
    JsonSchemaFormService,
    FrameworkLibraryService,
    WidgetLibraryService,
    { provide: Framework, useClass: TeepeeFramework, multi: true },
  ],
  entryComponents: [...ANGULAR_MATERIAL_MODULES],
})
export class TeepeeFrameworkModule {
  constructor() {
    fixAngularFlex();
  }

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: TeepeeFrameworkModule,
      providers: [MatIconRegistry],
    };
  }
}
