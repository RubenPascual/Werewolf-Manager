import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Rol } from 'src/interfaces/rol.model';

@Component({
  selector: 'app-rol-details',
  templateUrl: './rol-details.component.html',
  styleUrls: ['./rol-details.component.scss'],
})
export class RolDetailsComponent implements OnInit {

  constructor(private mdoalCtrl: ModalController) { }

  @Input() rol: Rol;

  ngOnInit() {}

  dismiss() {
    /**
     * La pestaña de modal se cierra
     */
    this.mdoalCtrl.dismiss();
  }

}
