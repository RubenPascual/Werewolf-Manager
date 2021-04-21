import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../../services/players.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-player-creation',
  templateUrl: './player-creation.page.html',
  styleUrls: ['./player-creation.page.scss'],
})

export class PlayerCreationPage implements OnInit {

  inputValue = '';
  buttonDisabled = true;
  numberPlayers = 0;
  players: string[];


  constructor(
    private playersService: PlayersService,
    private alertController: AlertController
    ) {}

  async presentAlert() {

    const alert = await this.alertController.create({
        cssClass: 'alert',
        header: 'Error',
        message: 'There is already a player with that name. Please choose a diferent name',
        buttons: ['OK']
    });

    await alert.present();
  }

  ngOnInit() {
    this.updatePlayers();
  }

  addPlayer(){
    /**
     * Añade a un jugador al array de jugadores en caso de que el jugador no este ya
     * en la lista de jugadors. Si el jugador ya esta muestra una alerta al usuario
     */

    if (this.inputValue !== ''){

      const success = this.playersService.addPlayer(this.inputValue);
      this.inputValue = '';
      this.updatePlayers();

      if (!success) {
        this.presentAlert();
      }
    }
  }

  deletePlayer(player: string){
    /**
     * Elimina al jugador del array de jugadores y actualiza la lista
     *
     * Argumentos
     *  - plyaer: string Nombre del jugador
     */
    this.playersService.deletePlayer(player);
    this.updatePlayers();
  }

  updatePlayers(){
    /**
     * Actualiza el array de jugadores y activa el botton de accept en caso de ser posible
     */
    this.players = this.playersService.getAllPlayers();
    this.buttonDisabled = this.players.length < 4;
    this.numberPlayers = this.players.length;
  }
}
