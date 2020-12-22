import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TeepeeFormModule } from 'src/app/shared/component/teepee-form/teepee-form.module';

import { ProfilComponent } from './profil.component';

@NgModule({
    imports: [CommonModule, TeepeeFormModule],
    exports: [ProfilComponent],
    declarations: [ProfilComponent],
})
export class ProfilModule { }
