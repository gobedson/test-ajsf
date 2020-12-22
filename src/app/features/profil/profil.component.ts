import { Component } from "@angular/core";
import profilForm from 'src/app/features/profil/schemas/profilForm.json';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {
  public profilForm = profilForm;
  public data = {};
}
