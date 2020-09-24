import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';
import { HeroService } from '../hero.service';
import { MessageService } from '../messages.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  // heroes = HEROES;
  heroes: Hero[];
  selectedHero: Hero;

  constructor(
    private heroService: HeroService,
    private MessageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
    console.log(this.selectedHero);
    this.MessageService.add(
      `HeroComponent: Selected hero id is: ${this.selectedHero.id}, name is: ${this.selectedHero.name}`
    );
  }

  // getHeroes(): void {
  //   this.heroes = this.heroService.getHeroes();
  // }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }
}
