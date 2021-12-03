import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tccreator-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
