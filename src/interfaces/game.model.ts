import { Rol } from './rol.model';

export interface Game{
  gameName?: string;
  saveDate?: string;
  numPlayers?: number;
  playersRol: { [key: string]: Rol };
  allPlayers?: string[];
  alivePlayers?: string[];
  rolOrder?: string[];
  currentRol?: number;
  nightKilledPlayers?: string[];
  showDeadList?: boolean;
  removableRols?: string[];
  lovers?: {[key: string]: string};
  loversEnding?: boolean;
  whitchPotions?: { [key: string]: 0 | 1};
}
