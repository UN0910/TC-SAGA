import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onToggle() {
    const menuToggle = document.querySelector(".toggle");
    const showcase = document.querySelector(".showcase");

    menuToggle.classList.toggle("active");
    showcase.classList.toggle("active");
  }
}
