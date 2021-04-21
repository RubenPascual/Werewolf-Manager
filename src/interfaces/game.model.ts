import { Rol } from './rol.model';

export interface Game{
  playersRol: { [key: string]: Rol };
  gameName: string;
  saveDate: string;
  numPlayers: number;
  alivePlayers: string[];
  rolOrder: string[];
  currentRol: number;
}
