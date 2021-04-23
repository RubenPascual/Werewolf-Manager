import { Game } from './../interfaces/game.model';
import { Rol } from './../interfaces/rol.model';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})

export class GameService {

  private game: Game;
  private rolOrder = ['Cupid', 'Werewolf', 'Seer', 'Witch', 'Villager'];

  constructor(
    private storage: NativeStorage
  ) {}

  initializeGame(playersRol: { [key: string ]: Rol}, players: string[]){
    /**
     * Creates an object of the Class game with the initialized parameters
     *
     * Arguments:
     *  - playersRol: { [key: string ]: Rol} Dictionary with the players and their Roles
     *  - players: string[] Array with all the players
     */

    const gameRoles = players.map( player => playersRol[player].id);

    this.game = {
      playersRol,
      gameName: '',
      saveDate: '',
      numPlayers: players.length,
      allPlayers: players,
      alivePlayers: players,
      nightKilledPlayers: [],
      currentRol: 0,
      rolOrder: this.rolOrder.filter( rol => gameRoles.indexOf(rol) > -1),
      showDeadList: false,
      lovers: {},
      loversEnding: false,
      removableRols: [],
      whitchPotions: { killNight: 1, heal: 1}
      };
  }

  async saveGame(name): Promise<boolean>{

    const keys = await this.storage.keys();
    const contains = keys.filter( key => key === name).length > 0;

    if (!contains){
      this.game.gameName = name;
      this.game.saveDate = new Date().toLocaleDateString();
      await this.storage.setItem(name, this.game);
    }

    return contains;
  }

  async removeGame(name: string){
    await this.storage.remove(name);
  }

  getAllSavedGames(): Promise<Game[]>{
    return this.storage.keys().then( data => {
      return Promise.all(data.map( key => this.storage.getItem(key)));
    });
  }

  loadGame(game: Game){
    this.game = game;
  }

  getGame(){
      /**
       * Returns a reference to the current game
       */
      return this.game;
    }
  }
