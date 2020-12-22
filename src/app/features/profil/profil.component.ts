import { Component } from "@angular/core";
import profilForm from './schemas/profilForm.json';
import newProfilForm from './schemas/newProfilForm.json';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {
  public model: unknown = {};
  public profilForm: any;

  public ngOnInit(): void {
    this.profilForm = profilForm;
  }
}