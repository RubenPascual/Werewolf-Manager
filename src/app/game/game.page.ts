import { element } from 'protractor';
import { RolesService } from 'src/services/roles.service';
import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/services/game.service';
import { Game } from 'src/interfaces/game.model';
import { Rol } from 'src/interfaces/rol.model';
import { Router } from '@angular/router';
import { PlayersService } from 'src/services/players.service';
import { AlertController, ModalController } from '@ionic/angular';
import { RolDetailsComponent } from '../roles/rol-details/rol-details.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})

export class GamePage implements OnInit {

  game: Game;
  actualRol: Rol;
  targetList: string[];
  selectedTarget = '';
  secondSelectedTarget = '';
  winingSide = '';
  instructIndx = 0;
  witchAction = 'heal';
  winingList: string[];
  endGame = false;

  constructor(
    private gameService: GameService,
    private rolesService: RolesService,
    private playerService: PlayersService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.game = this.gameService.getGame();
    this.actualRol = this.rolesService.getRolInfo(this.game.rolOrder[this.game.currentRol]);
    this.targetList = this.getTargetList();
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
    if ( this.actualRol.id === 'Cupid'){

      if (this.selectedTarget === ''){
        this.selectedTarget = target;
      }else if (this.selectedTarget === target){
        if (this.secondSelectedTarget === ''){
          this.selectedTarget = '';
        }else{
          this.selectedTarget = this.secondSelectedTarget;
          this.secondSelectedTarget = '';
        }
      }else if (this.secondSelectedTarget === target){
        this.secondSelectedTarget = '';
      }else{
        this.secondSelectedTarget = target;
      }

    }else{
      if (this.selectedTarget === target){
        this.selectedTarget = '';
      }else{
        this.selectedTarget = target;
      }
    }
  }

  async confirmAction(update: boolean){

    if (this.actualRol.id === 'Cupid'){
      if (this.selectedTarget !== '' && this.secondSelectedTarget !== ''){
        this.game.lovers[this.selectedTarget] = this.secondSelectedTarget;
        this.game.lovers[this.secondSelectedTarget] = this.selectedTarget;
        // tslint:disable-next-line: max-line-length
        this.game.loversEnding = this.game.playersRol[this.selectedTarget].rolType !== this.game.playersRol[this.secondSelectedTarget].rolType;
        this.selectedTarget = '';
        this.secondSelectedTarget = '';
        this.game.removableRols.push('Cupid');
        this.updateGameState();
      }
    }else{
      if (this.selectedTarget !== ''){
        switch (this.actualRol.action) {
          case 'killNight': {
            this.game.nightKilledPlayers.push(this.selectedTarget);
            break;
          }
          case 'killDay': {
            this.game.alivePlayers = this.game.alivePlayers.filter( player => player !== this.selectedTarget);
            if (Object.keys(this.game.lovers).indexOf(this.selectedTarget) > -1){
              this.game.alivePlayers = this.game.alivePlayers.filter( player => player !== this.game.lovers[this.selectedTarget]);
              this.game.loversEnding = false;
            }
            this.checkEndGame();

            break;
          }
          case 'potions': {

            if (this.witchAction === 'heal' && this.game.whitchPotions[this.witchAction] === 1){
              this.game.whitchPotions[this.witchAction] = 0;
              this.game.nightKilledPlayers = this.game.nightKilledPlayers.filter( player => player !== this.selectedTarget);

            }else if (this.witchAction === 'killNight' && this.game.whitchPotions[this.witchAction] === 1){
              this.game.whitchPotions[this.witchAction] = 0;
              this.game.nightKilledPlayers.push(this.selectedTarget);
            }

            break;
          }
          case 'investigate': {
            const modal = await this.modalCtrl.create({
              component: RolDetailsComponent,
              componentProps: {
                rol: this.game.playersRol[this.selectedTarget]
              }
            });

            await modal.present();

            break;
          }
        }
      }

      this.selectedTarget = '';

      if (update){
        this.updateGameState();
      }
    }

  }

  updateGameState(){

    let nextIndex;
    let nextRol;

    if (this.actualRol.id === 'Villager'){
      const aliveRols: string[] = this.game.alivePlayers.map( player => this.game.playersRol[player].id);
      const deadRols = this.game.rolOrder.filter( rol => {
        const notAlive = aliveRols.indexOf(rol) === -1;
        const notEsential = rol !== 'Werewolf' && rol !== 'Villager';
        const oneTimeRol = this.game.removableRols.indexOf(rol) > -1;
        return (notAlive && notEsential) || oneTimeRol;
      });

      if (deadRols.length > 0){
        do{
          this.game.currentRol = (this.game.currentRol + 1) % this.game.rolOrder.length;
        }while (deadRols.indexOf(this.game.rolOrder[this.game.currentRol]) > -1);

        nextRol = this.rolesService.getRolInfo(this.game.rolOrder[this.game.currentRol]);
        this.game.rolOrder = this.game.rolOrder.filter( rol => deadRols.indexOf(rol) === -1);
        nextIndex = this.game.rolOrder.findIndex( rol => rol === nextRol.id);
      }else{
        nextIndex = (this.game.currentRol + 1) % this.game.rolOrder.length;
        nextRol = this.rolesService.getRolInfo(this.game.rolOrder[nextIndex]);
      }

      this.game.removableRols = [];
    }else{
      nextIndex = (this.game.currentRol + 1) % this.game.rolOrder.length;
      nextRol = this.rolesService.getRolInfo(this.game.rolOrder[nextIndex]);
    }

    if (nextRol.id === 'Villager'){
      if (!this.game.showDeadList){

        const loverkillList: string[] = [];
        this.game.nightKilledPlayers.forEach( player => {
          if (Object.keys(this.game.lovers).indexOf(player) > -1) {
            loverkillList.push(this.game.lovers[player]);
            this.game.loversEnding = false;
          }
        });

        this.game.nightKilledPlayers = this.game.nightKilledPlayers.concat(loverkillList).filter( player => player != null);
        this.game.nightKilledPlayers = this.game.nightKilledPlayers.filter( (item, pos) => {
          return this.game.nightKilledPlayers.indexOf(item) === pos;
        });

        this.game.alivePlayers = this.game.alivePlayers.filter( player => this.game.nightKilledPlayers.indexOf(player) === -1);
        this.game.showDeadList = true;
      }else{
        this.game.nightKilledPlayers = [];
        this.game.showDeadList = false;
        this.game.currentRol = nextIndex;
        this.actualRol = nextRol;
        this.checkEndGame();
      }
    }else{
      this.game.currentRol = nextIndex;
      this.actualRol = nextRol;
    }

    if (this.actualRol.id === 'Witch'){
      this.segmentChanged();
    }else{
      this.instructIndx = 0;
    }

    this.targetList = this.getTargetList();
  }

  checkEndGame(){

    const werewolves = this.game.alivePlayers.filter(player => this.game.playersRol[player].rolType === 'Werewolves').length;
    const notWerewolves = this.game.alivePlayers.length - werewolves;

    console.log(this.game.loversEnding);

    if (this.game.loversEnding && this.game.alivePlayers.every( player => Object.keys(this.game.lovers).indexOf(player) > -1)){
      this.endGame = true;
      this.winingSide = 'Lovers Won';
      this.winingList = this.game.alivePlayers;
    }else if ( werewolves > notWerewolves && !this.game.loversEnding){
      this.endGame = true;
      this.winingSide = 'Werewolves Won';
      this.winingList = this.game.allPlayers.filter(player => {
        const rolType = this.game.playersRol[player].rolType === 'Werewolves';
        const notLover = Object.keys(this.game.lovers).indexOf(player) === -1;
        return rolType && notLover;
      });
    }else if ( werewolves === 0){
      this.endGame = true;
      this.winingSide = 'Townsfolk Won';
      this.winingList = this.game.allPlayers.filter(player => {
        const rolType = this.game.playersRol[player].rolType === 'Townsfolk';
        const notLover = Object.keys(this.game.lovers).indexOf(player) === -1;
        console.log(player);
        console.log(notLover);
        return rolType && notLover;
      });
    }
  }

  segmentChanged(){
    if (this.witchAction === 'heal'){
      this.instructIndx = 0;
    }else{
      this.instructIndx = 1;
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
