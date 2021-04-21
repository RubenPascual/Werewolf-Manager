import { Component, OnInit } from '@angular/core';
import { RolesService } from 'src/services/roles.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(private rolesService: RolesService) {}

  ngOnInit() {
    this.rolesService.intializeRoles();
  }
}
