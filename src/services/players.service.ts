import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private players: string[] = [];

  constructor() { }

  getAllPlayers() {
    /**
     * Return a copy of the array of players
     *
     * Devuelve
     *  -player: string[] Copy of the array of players
     */
    return [...this.players];
  }

  addPlayer(player: string): boolean{
    /**
     * Adds a player to the array if it is not already in it
     *
     * Argumentos
     *  - plyaer: string Name of the player
     *
     * Devuelve
     *  - bool True in case of succes False in case of no succes
     */
    if (this.players.findIndex( (name) => name.toLocaleLowerCase() === player.toLocaleLowerCase()) !== -1) {
      return false;
    }else {
      this.players.push(player);
      return true;
    }
  }

  deletePlayer(player: string) {
    /**
     * Deletes a player from the list of players
     *
     * Arguments
     *  - plyaer: string Name of the player
     */

    const index = this.players.findIndex( (name) => name.toLocaleLowerCase() === player.toLocaleLowerCase());
    if (index !== -1) {
      this.players.splice(index, 1);
    }
  }

  resetPlayers(){
    /**
     * Sets the array of players to empty
     */
    this.players = [];
  }

}
