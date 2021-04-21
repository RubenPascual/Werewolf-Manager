import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Rol} from '../interfaces/rol.model';

@Injectable({
  providedIn: 'root'
})

export class RolesService {

  private roles: Rol[] = [];
  private dataURL = 'assets/data/roles.json';

  constructor(private http: HttpClient) { }

  intializeRoles(){
    /**
     * Gets the information for the roles from the json file and updates the array of roles that
     * gets as an argument
     *
     * Arguments:
     *  -roles: Rol[] Array of roles that has to be updated once the observable has all data
     */
    const rolObservable: Observable<Rol[]> = this.http.get<Rol[]>(this.dataURL);
    // tslint:disable-next-line: deprecation
    rolObservable.subscribe({ next: data => this.roles = data });
  }

  getAllRoles() {
    /**
     * Devuelve una copia del array de roles que guarda el servicio
     *
     * Devuelve
     *  -roles: string[] Copia del array de roles
     */
    return [...this.roles];
  }

  getRolInfo(name: string) {
    /**
     * Return the information of the rol with id name
     */
    return this.roles.find( rol => rol.id === name);
  }

  changeRolPlayers(id: string, increase: number): boolean{
    /**
     * Cambia el numero de jugadores del rol
     *
     * Argumentos:
     *  -id: string Identificador del rol al que cambiar el numero de jugadores
     *  -increase: number Numero de jugadores a incrementar o disminuir
     *
     * Devuelve
     *  -boolean True en caso de adicion correcta, false en caso de que se intente disminuir los jugadores por debajo de 0
     */
    const foundRol = this.roles.find( (rol) => rol.id === id);

    const numPlayers = foundRol.numPlayers + increase;

    if (numPlayers < 0){
      return false;
    }else {

      if ( foundRol.maxPlayers === 0){
        foundRol.numPlayers = numPlayers;
        return true;
      }else if ( foundRol.maxPlayers >= numPlayers){
        foundRol.numPlayers = numPlayers;
        return true;
      }else{
        return false;
      }
    }
  }

  resetRoles(){
    this.roles.forEach( rol => rol.numPlayers = 0);
  }
}
