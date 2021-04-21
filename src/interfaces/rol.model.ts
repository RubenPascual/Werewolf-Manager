export interface Rol{
  id?: string;
  description?: string;
  instructions?: string;
  numPlayers?: number;
  maxPlayers?: number;
  rolType?: string;
  imageURL?: string;
  targetRoles?: string[];
}
