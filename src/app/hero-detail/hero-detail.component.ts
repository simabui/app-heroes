import { Component, Input, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { Hero } from '../heroes/hero';

@Component({
  selector: 'hero-details',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeroDetailComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  @Input() hero?: Hero;
}
