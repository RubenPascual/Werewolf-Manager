import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerRolPage } from './player-rol.page';

const routes: Routes = [
  {
    path: '',
    component: PlayerRolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerRolPageRoutingModule {}
