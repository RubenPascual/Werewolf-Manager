export interface Rol{
  id?: string;
  description?: string;
  instructions?: string[];
  numPlayers?: number;
  maxPlayers?: number;
  action?: string;
  rolType?: string;
  imageURL?: string;
  targetRoles?: string[];
}
