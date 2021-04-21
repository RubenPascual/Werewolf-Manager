import { RolesService } from 'src/services/roles.service';
import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/services/game.service';
import { Game } from 'src/interfaces/game.model';
import { Rol } from 'src/interfaces/rol.model';
import { Router } from '@angular/router';
import { PlayersService } from 'src/services/players.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})

export class GamePage implements OnInit {

  private game: Game;
  actualRol: Rol;
  targetList: string[];
  selectedTarget = '';
  winingSide = '';
  winingList: string[];
  endGame = false;

  constructor(
    private gameService: GameService,
    private rolesService: RolesService,
    private playerService: PlayersService,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.game = this.gameService.getGame();
    this.game.currentRol = this.game.rolOrder.length - 1;
    this.updateGameState();
  }

  async presentAlert() {
    if (this.game.gameName !== ''){
      this.gameService.removeGame(this.game.gameName);
      this.gameService.saveGame(this.game.gameName);
    }else{
      const alert = await this.alertCtrl.create({
        cssClass: 'alert',
        header: 'Save Game',
        message: 'Chose a name for the game',
        inputs: [
          {
            name: 'gameName',
            type: 'text',
            placeholder: 'Game Name'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          }, {
            text: 'Ok',
            handler: (alertData) => {
              if ( alertData.gameName === ''){
                this.messageAlert(true);
              }else{
                this.gameService.saveGame(alertData.gameName).then( data => {
                  if (data){
                    this.messageAlert(false);
                  }
                });
              }
            }
          }
        ]
      });

      await alert.present();
    }
  }

  async messageAlert(error){

    let alert;

    if (error){
      alert = await this.alertCtrl.create({
        cssClass: 'alert',
        header: 'Error',
        message: 'The name field of the game should not be empty',
        buttons: [{
        text: 'OK',
            handler: () => {
              this.presentAlert();
            }
        }]
      });
    }else{
      alert = await this.alertCtrl.create({
        cssClass: 'alert',
        header: 'Infor',
        message: 'There already exist a game with that name. Do you want overwrite it?',
        buttons: [{
        text: 'No',
            handler: () => {
              this.presentAlert();
            }
        },
        {
          text: 'Yes',
          handler: () => {
            this.gameService.removeGame(this.game.gameName);
            this.gameService.saveGame(this.game.gameName);
          }
        }]
      });
    }

    await alert.present();
  }

  getTargetList(){
    return this.game.alivePlayers.filter( player => this.actualRol.targetRoles.indexOf(this.game.playersRol[player].id ) > -1);
  }

  selectTarget(target: string){
    /**
     * It selects the target of the actualRol
     *
     * Arguments:
     *  -target: strign Name of the selected target
     */
    if (this.selectedTarget === target){
      this.selectedTarget = '';
    }else{
      this.selectedTarget = target;
    }
  }

  confirmAction(){
    if (this.selectedTarget !== ''){
      this.game.alivePlayers = this.game.alivePlayers.filter( player => player !== this.selectedTarget);
      this.checkEndGame();
    }
    this.updateGameState();
  }

  updateGameState(){
    this.game.currentRol = (this.game.currentRol + 1) % this.game.rolOrder.length;
    this.actualRol = this.rolesService.getRolInfo(this.game.rolOrder[this.game.currentRol]);
    this.targetList = this.getTargetList();
  }

  checkEndGame(){
    const werewolves = this.game.alivePlayers.filter(player => this.game.playersRol[player].rolType === 'Werewolves').length;
    const notWerewolves = this.game.alivePlayers.length - werewolves;

    if ( werewolves > notWerewolves){
      this.endGame = true;
      this.winingSide = 'Werewolves Won';
      this.winingList = this.game.alivePlayers.filter(player => this.game.playersRol[player].rolType === 'Werewolves');
    }else if( werewolves === 0){
      this.endGame = true;
      this.winingSide = 'Townsfolk Won';
      this.winingList = this.game.alivePlayers.filter(player => this.game.playersRol[player].rolType !== 'Werewolves');
    }
  }

  exitGame(){
    this.playerService.resetPlayers();
    this.rolesService.resetRoles();
    this.router.navigate(['/home']);
  }

  replayGame(){
    this.router.navigate(['/roles']);
  }
}
