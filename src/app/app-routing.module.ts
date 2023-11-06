import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; //  So the application can have routing capability

import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { HeroesComponent } from './heroes/heroes.component'; // Gives the Router somewhere to go once you configure the routes

// Routes tell the Router which view to display when a user clicks a link or pastes a URL into the browser address bar.
// When the URL is something like localhost:4200/heroes:
const routes: Routes = [
  {
    path: 'heroes',
    component: HeroesComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'detail/:id',
    component: HeroDetailComponent,
  },
  {
    path:'',
    redirectTo:'/dashboard',
    pathMatch: 'full',
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule], // Exports RouterModule to be available throughout the application.
})
export class AppRoutingModule {}
