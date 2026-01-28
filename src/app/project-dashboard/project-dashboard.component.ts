import { Component } from '@angular/core';

@Component({
  selector: 'app-project-dashboard',
  imports: [],
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.css'
})
export class ProjectDashboardComponent {
  activeTab: string = 'MainPage';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
