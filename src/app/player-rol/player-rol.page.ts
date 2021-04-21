import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/services/game.service';
import { PlayersService } from 'src/services/players.service';
import { RolesService } from 'src/services/roles.service';
import { Rol } from '../../interfaces/rol.model';

@Component({
  selector: 'app-player-rol',
  templateUrl: './player-rol.page.html',
  styleUrls: ['./player-rol.page.scss'],
})
export class PlayerRolPage implements OnInit {

  roles: Rol[];
  players: string[];
  playersRol: { [key: string]: Rol } = {};

  constructor(
    private rolesService: RolesService,
    private playerService: PlayersService,
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit() {
    this.shuffle();
  }

  shuffle(){

    this.players = this.playerService.getAllPlayers();
    this.roles = this.rolesService.getAllRoles();

    for (let i = this.players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.players[i];
      this.players[i] = this.players[j];
      this.players[j] = temp;
    }

    let index = 0;
    this.roles.forEach(rol => {
      let numPlayers = 0;
      while (numPlayers < rol.numPlayers){
        this.playersRol[this.players[index]] = rol;
        numPlayers++;
        index++;
      }
    });

  }

  startGame(){
    this.gameService.initializeGame(this.playersRol, this.players);
    this.router.navigate(['/game']);
  }
}
