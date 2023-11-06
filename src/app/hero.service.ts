import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service'; // This is an example of a typical service-in-service scenario in which you inject the MessageService into the HeroService which is injected into the HeroesComponent.

// The HeroService could get hero data from anywhere such as a web service, local storage, or a mock data source.
// When you provide the service at the root level, Angular creates a single, shared instance of HeroService and injects into any class that asks for it.
// Registering the provider in the @Injectable metadata also allows Angular to optimize an application by removing the service if it isn't used.
@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes'; // URL to web api (:base/:collectionName)

  // The heroes web API expects a special header in HTTP save requests
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };


  constructor(private http: HttpClient, private messageService: MessageService) { }

  // of(HEROES) returns an Observable<Hero[]> that emits a single value, the array of mock heroes.
  // Create a method to return the mock heroes.
  getHeroes(): Observable<Hero[]> {
    // const heroes = of(HEROES)
    // this.messageService.add('HeroService: fetched heroes');
    // return heroes;
    return this.http.get<Hero[]>(this.heroesUrl).pipe(tap(_ => this.log('fetched heroes')), catchError(this.handleError<Hero[]>('getHeroes', []))); // HttpClient.get() returns the body of the response as an untyped JSON object by default.
  }

  getHero(id:number): Observable<Hero> {
    // const hero = HEROES.find(h => h.id === id)!;
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    // return of(hero);
    const url = `${this.heroesUrl}/${id}`; // constructs a request URL with the desired hero's id
    return this.http.get<Hero>(url).pipe(tap(_ => this.log(`fetched hero id=${id}`)), catchError(this.handleError<Hero>(`getHero id=${id}`)));
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(tap((newHero:Hero) => this.log(`added hero with id=${newHero.id}`)), catchError(this.handleError<Hero>('addHero')));
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(tap(_ => this.log(`deleted hero id=${id}`)), catchError(this.handleError<Hero>('deleteHero')));
  }

  searchHeroes(term: string): Observable<Hero[]> {
    // If search term not found, return empty hero array.
    if(!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(tap(x => x.length ? this.log(`found heroes matching "${term}`) : this.log(`no heroes matching "${term}`)), catchError(this.handleError<Hero[]>('searchHeroes, []')));
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(tap(_ => this.log(`updated hero id=${hero.id}`)), catchError(this.handleError<any>('updateHero')));
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

//  @param operation - name of the operation that failed
//  @param result - optional value to return as the observable result
// handleError() takes a type parameter <T> to return the safe value as the type that the application expects.
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error);
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }

}
