import { TuiRoot } from "@taiga-ui/core";
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'BachelorApp--FrontEnd';
  loggedIn: boolean = false;

  ngOnInit() {
    this.isUserLoggedIn();
  }

  isUserLoggedIn(): boolean {
    localStorage.getItem("accessToken") ? this.loggedIn = true : this.loggedIn = false;
    return this.loggedIn;
  }
}
