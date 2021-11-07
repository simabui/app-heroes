import { Injectable } from '@angular/core';
import { Hero } from './heroes/hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  private heroesUrl = 'api/heroes';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getHeroes(): Observable<Hero[]> {
    const heroes = this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );

    return heroes;
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    const hero = this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero`))
    );
    return hero;
  }

  updateHero(hero: Hero): Observable<Object | Hero> {
    const updatedHero = this.http
      .put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((_) => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<Hero>('updateHero'))
      );

    return updatedHero;
  }

  addHero(value: Hero): Observable<Hero> {
    const newHero = this.http
      .post<Hero>(this.heroesUrl, value, this.httpOptions)
      .pipe(
        tap((newHero: Hero) => this.log(`add new hero id= ${newHero.id}`)),
        catchError(this.handleError<Hero>('updateHero'))
      );

    return newHero;
  }

  deleteHero(value: Hero): Observable<Hero> {
    const url = `${this.heroesUrl}/${value.id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`delete hero id=${value.id}`)),
      catchError(this.handleError<Hero>('deletedHero'))
    );
  }

  searchHeros(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found heros matching "${term}"`)
          : this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searcHeroes', []))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
