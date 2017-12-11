import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './../../pages/home/home.component';
import { SettingsComponent } from './../../pages/settings/settings.component';
import { ShopComponent } from './../../pages/shop/shop.component';
import { FieldsComponent } from './../../pages/fields/fields.component';
import { SeedsComponent } from './../../pages/seeds/seeds.component';
import { CropsComponent } from './../../pages/crops/crops.component';
import { FarmingSubjectDetailComponent } from './../../components/farming-subject-detail/farming-subject-detail.component';

const routes: Routes = [ {
    path: '', redirectTo: '/home', pathMatch: 'full' }, {
    path: 'home',
    component: HomeComponent
  }, {
    path: 'settings',
    component: SettingsComponent
  }, {
    path: 'shop',
    component: ShopComponent
  }, {
    path: 'fields',
    component: FieldsComponent
  }, {
    path: 'seeds',
    component: SeedsComponent
  }, {
    path: 'seeds/:name',
    component: FarmingSubjectDetailComponent
  }, {
    path: 'crops',
    component: CropsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class RoutingModule { }
