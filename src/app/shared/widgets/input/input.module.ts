import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from './input.component';

@NgModule({
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatIconModule],
  exports: [InputComponent],
  declarations: [InputComponent],
})
export class InputModule {}
