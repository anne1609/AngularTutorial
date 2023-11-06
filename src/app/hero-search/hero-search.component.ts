import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>(); // Becomes an Observable emitting a steady stream of search terms

  constructor(private heroService: HeroService) { }

  // Push a search term into the observable stream
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    // wait 300ms after each keystroke before considering the term - requests aren't likely to happen more frequently than 300 ms
    this.heroes$ = this.searchTerms.pipe(debounceTime(300),
    // ignore new term if same as previous term
    distinctUntilChanged(),
    // switch to new search observable each time the term changes
    // switchMap() preserves the original request order while returning only the observable from the most recent HTTP method call. Results from prior calls are canceled and discarded.
    switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }

}
