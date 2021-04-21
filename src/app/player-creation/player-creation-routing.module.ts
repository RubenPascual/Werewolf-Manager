import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerCreationPage } from './player-creation.page';

const routes: Routes = [
  {
    path: '',
    component: PlayerCreationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerCreationPageRoutingModule {}
