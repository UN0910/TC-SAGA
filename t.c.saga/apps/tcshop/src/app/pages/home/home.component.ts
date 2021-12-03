import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@t.c.saga/user';

@Component({
  selector: 'tcshop-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onToggle() {
    const menuToggle: Element | any = document.querySelector(".toggle");
    const showcase: Element | any = document.querySelector(".showcase");

    menuToggle.classList.toggle("active");
    showcase.classList.toggle("active");
  }

}
