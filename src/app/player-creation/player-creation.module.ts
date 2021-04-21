import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayerCreationPageRoutingModule } from './player-creation-routing.module';

import { PlayerCreationPage } from './player-creation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayerCreationPageRoutingModule
  ],
  declarations: [PlayerCreationPage]
})
export class PlayerCreationPageModule {}
