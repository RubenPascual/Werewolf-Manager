import { RolDetailsComponent } from './rol-details/rol-details.component';
import { RolesService } from './../../services/roles.service';
import { PlayersService } from './../../services/players.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Rol } from '../../interfaces/rol.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
})
export class RolesPage implements OnInit {

  roles: Rol[];
  players: string[];
  buttonDisabled: boolean;
  totalRolPlayers: number;

  constructor(
    private rolesService: RolesService,
    private playerService: PlayersService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private router: Router
    ) {}

  async presentAlert() {

    const alert = await this.alertCtrl.create({
        cssClass: 'alert',
        header: 'Error',
        message: 'There should be more players from Townsfolk and Independent than Werewolves',
        buttons: ['OK']
    });

    await alert.present();
  }

  ngOnInit() {
    this.roles = this.rolesService.getAllRoles();
    this.players = this.playerService.getAllPlayers();
    this.checkNumPlayers();
  }

  checkNumPlayers(){
    /**
     * Checks if the number of total players in each rol is the same as the number of players.
     * In case its not it restarts the number of players on each rol
     */
    let numPlayersRol = 0;
    this.roles.forEach( rol => numPlayersRol += rol.numPlayers);

    if ( this.players.length < numPlayersRol){
      this.roles.forEach( rol => rol.numPlayers = 0);
      this.totalRolPlayers = 0;
    }else{
      this.totalRolPlayers = numPlayersRol;
    }

    this.buttonDisabled = this.players.length !== this.totalRolPlayers;
  }

  addPlayerToRol(event: Event, id: string, num: number){
    /**
     * Añade o disminuye el numero de jugadores de un Rol siempre que sea posible
     *
     * Argumentos:
     *  -id: string Identificador del rol al que cambiar el numero de jugadores
     *  -num: number Numero de jugadores a incrementar o disminuir
     */
    if (this.totalRolPlayers + num <= this.players.length ){
      if (this.rolesService.changeRolPlayers(id, num)){
        this.totalRolPlayers += num;
        this.updateRoles();
      }
    }
    event.stopPropagation();
  }

  async showRolDetails(rol: Rol){
    /**
     * Genera la pagina de modal con la informacion del Rol
     *
     * Argumentos:
     *  -rol: Rol Rol del que queremos mostrar la informacion
     */
    const modal = await this.modalCtrl.create({
      component: RolDetailsComponent,
      componentProps: {
        rol
      }
    });

    await modal.present();

  }

  updateRoles(){
    /**
     * Actualiza el array de roles y activa el botton de accept en caso de ser posible
     */
    this.roles = this.rolesService.getAllRoles();
    this.buttonDisabled = this.players.length !== this.totalRolPlayers;
  }

  checkRoles(){
    let werewolves = 0;
    let others = 0;
    this.roles.forEach( rol => rol.rolType === 'Werewolves' ? werewolves += rol.numPlayers : others += rol.numPlayers);

    if (others >= werewolves) {
      this.router.navigate(['/player-rol']);
    }else{
      this.presentAlert();
    }
  }

}
