import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Game } from 'src/interfaces/game.model';
import { GameService } from 'src/services/game.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-load-game',
  templateUrl: './load-game.page.html',
  styleUrls: ['./load-game.page.scss'],
})
export class LoadGamePage implements OnInit {

  gameList: Game[] = [];

  constructor(
    private gameService: GameService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.gameService.getAllSavedGames().then(data => this.gameList = data);
  }

  async deleteGame(game: Game){

    const alert = await this.alertCtrl.create({
      cssClass: 'alert',
      header: 'Delete Game',
      message: 'Are you sure you want to delete the game?',
      buttons: [{
        text: 'No',
        role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.gameService.removeGame(game.gameName).then( () => {
              this.gameService.getAllSavedGames().then(data => this.gameList = data);
            });
          }
        }]
    });

    await alert.present();
  }

  loadGame(game: Game){
      this.gameService.loadGame(game);
      this.router.navigate(['/game']);
  }

}
