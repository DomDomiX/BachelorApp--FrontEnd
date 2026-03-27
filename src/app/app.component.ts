import { TuiRoot } from "@taiga-ui/core";
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'BachelorApp--FrontEnd';
  loggedIn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    
  }

  get isUserLoggedIn(): boolean {
    return !!localStorage.getItem("accessToken");
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }
}
