import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RolesPageRoutingModule } from './roles-routing.module';

import { RolesPage } from './roles.page';
import { RolDetailsComponent } from './rol-details/rol-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RolesPageRoutingModule
  ],
  declarations: [RolesPage, RolDetailsComponent],
  entryComponents: [RolDetailsComponent]
})
export class RolesPageModule {}
