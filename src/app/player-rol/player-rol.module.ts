import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayerRolPageRoutingModule } from './player-rol-routing.module';

import { PlayerRolPage } from './player-rol.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayerRolPageRoutingModule
  ],
  declarations: [PlayerRolPage]
})
export class PlayerRolPageModule {}
