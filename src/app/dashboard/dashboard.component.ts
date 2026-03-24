import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { ProjectSetupService } from '../services/projectSetup.service';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-dashboard',
  imports: [TuiButton, TuiIcon, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  projectId: number | null = null;
  projects: any[] = [];
  tasks: any[] = [];
  loading: boolean = true;

  // Project Info
  projectInfo = {
    name: '',
    description: '', 
    deadline: new Date(), 
    technologies: [], 
    status: 'Active' 
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private projectSetupService: ProjectSetupService,
    private activityService: ActivityService
  ) {}

  ngOnInit() {
    this.loadAllProjects();
    this.loadAllTasks();
  }

  loadAllProjects() {
    this.loading = true;

    this.projectService.getUserProjects().subscribe({
      next: (res) => {
        const allProjects = res.projects || [];

        this.projects = allProjects.slice(0, 3);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.loading = false;
      }
    });
  }

  goToProject(id: number) {
    this.router.navigate(['/projectDashboard', id]);
    console.log('Navigating to project with ID:', id);
  }

  loadAllTasks() {
    this.loading = true;

    this.projectService.getAllTasks().subscribe({
      next: (res) => {
        const allTasks = res.tasks || [];

        this.tasks = allTasks
        .sort((a: any, b: any) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      })
      .slice(0, 3);

        console.log('Loaded tasks:', this.tasks);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.loading = false;
      }
    });
  }
}
