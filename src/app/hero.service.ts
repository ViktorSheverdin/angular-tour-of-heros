import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './messages.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  // constructor(private messageService: MessageService) {}
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  private heroesUrl = 'api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  // getHeroes(): Observable<Hero[]> {
  //   this.messageService.add('HeroService: fetched heroes');
  //   return of(HEROES);
  // }

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes!!!!!!')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      )
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // getHero(id: number): Observable<Hero> {
  //   // TODO: send the message _after_ fetching the hero
  //   this.messageService.add(`HeroService: fetched hero id=${id}`);
  //   return of(HEROES.find(hero => hero.id === id));
  // }
  // getHero(id:)

  getHero(id: number): Observable<Hero> {
    let new_url = `${this.heroesUrl}/${id}`
    console.log(`${this.heroesUrl}`)
    return this.http.get<Hero>(new_url)
      .pipe(
        tap(_ => this.log(`Hero with id ${id} has been retrieved`)),
        catchError(this.handleError<Hero>('getHero'))
      )
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<any>("updateHero"))
      )
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((justReturnedHero: Hero) => { this.log(`added hero w/ id=${justReturnedHero.id}`) }),
        catchError(this.handleError<Hero>('addHero'))
      )
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    let id = typeof hero === "number" ? hero : hero.id;
    let url = `${this.heroesUrl}/${id}`

    return this.http.delete<Hero>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`delete hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap(
          returned_array => returned_array.length ?
            this.log(`found hero matching ${term}`) :
            this.log(`no heroes matching ${term}`)
        ),
        catchError(this.handleError<Hero[]>('searchHeroes',[]))
      )
  }

}
