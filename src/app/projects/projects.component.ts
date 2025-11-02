import { Component } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-projects',
  imports: [TuiButton],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  showCreateForm: boolean = false;

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    console.log('Create form visibility:', this.showCreateForm);
  }
}
