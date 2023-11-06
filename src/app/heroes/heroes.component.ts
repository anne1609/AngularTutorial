import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  // Define a component property called heroes to expose the HEROES array for binding
  heroes: Hero[] = [];

  // Reserve the constructor for minimal initialization such as wiring constructor parameters to properties. 
  // The constructor shouldn't do anything! It certainly shouldn't call a function that makes HTTP requests to a remote server as a real data service would.
  // Add a private heroService parameter of type HeroService
  constructor(private heroService: HeroService, private messageService: MessageService) { }

  // Let Angular call ngOnInit() at an appropriate time after constructing a HeroesComponent instance
  ngOnInit(): void {
    this.getHeroes();
  }

  // If getHeroes() can't return immediately with hero data, it shouldn't be synchronous, because that would block the browser as it waits to return data.
  // Create a method to retrieve the heroes from the service.
  getHeroes(): void {
    // this.heroes = this.heroService.getHeroes(); // This won't work when the HeroService is actually making requests of a remote server.
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes); // This asynchronous approach works when the HeroService requests heroes from the server.
  }

  // When the given name isn't blank, the handler creates an object based on the hero's name. The handler passes the object name to the service's addHero() method.
  // When addHero() creates a new object, the subscribe() callback receives the new hero and pushes it into to the heroes list for display.
  add(name: string): void {
    name = name.trim();
    if(!name) {return;}
    this.heroService.addHero({name} as Hero).subscribe(hero => {this.heroes.push(hero);})
  }

  // The component's delete() method immediately removes the hero-to-delete from that list, anticipating that the HeroService succeeds on the server.
  // There's really nothing for the component to do with the Observable returned by heroService.deleteHero() but it must subscribe anyway.
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }

}
