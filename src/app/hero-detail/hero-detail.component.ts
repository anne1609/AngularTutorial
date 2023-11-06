import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // The "id" parameter is the id of the hero to display.
import { Location } from '@angular/common'; // An Angular service for interacting with the browser. This service lets you navigate back to the previous view.

import { HeroService } from '../hero.service'; // Gets hero data from the remote server and this component uses it to get the hero-to-display.
import { Hero } from '../hero';

// This component only receives a hero object through its hero property and displays it.
@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  // Add a hero property, preceded by the @Input() decorator.
  @Input() hero?: Hero
  
  constructor(private route: ActivatedRoute, private heroService: HeroService, private location: Location) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Route parameters are always strings --> this function converts the string to a number, which is what a hero id should be.
    this.heroService.getHero(id).subscribe(hero => this.hero = hero);
  }

  // Navigates backward one step in the browser's history stack
  goBack(): void {
    this.location.back();
  }

  // Persists hero name changes using the hero service updateHero() method and then navigates back to the previous view
  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
    }
  }

}
