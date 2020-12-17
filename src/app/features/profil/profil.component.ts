import { Component } from "@angular/core";
import profilForm from 'src/app/features/profil/schemas/profilForm.json';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {

  form = profilForm.form;
  schema = profilForm.schema.properties;
}
