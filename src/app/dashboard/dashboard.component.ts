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
  imports: [TuiIcon, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  projectId: number | null = null;
  projects: any[] = [];
  tasks: any[] = [];
  loading: boolean = true;
  endOffset: number[] = [];
  activities: any[] = [];

  // Calendar
  currentDate = new Date();
  daysInMonth: number[] = [];
  startOffset: number[] = []; 
  monthNames = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];
  allTasksForCalendar: any[] = []

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
    this.generateCalendar();
    this.loadActivities();
  }

  loadAllProjects() {
    this.loading = true;

    this.projectService.getUserProjects().subscribe({
      next: (res) => {
        const allProjects = res.projects || [];

        this.projects = allProjects.slice(0, 4);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.loading = false;
      }
    });
  }

  goToProject(project: any) {
  if (project.status === 'planning') {
    this.router.navigate(['/projectSetup', project.id]);
    console.log('Navigating to SETUP for project:', project.id);
  } else {
    this.router.navigate(['/projectDashboard', project.id]);
    console.log('Navigating to DASHBOARD for project:', project.id);
  }
}

  loadAllTasks() {
    this.loading = true;

    this.projectService.getAllTasks().subscribe({
      next: (res) => {
        const allTasks = res.tasks || [];

        this.allTasksForCalendar = allTasks.filter((t: any) => t.status !== 'completed');

        this.tasks = allTasks
        .filter((task: any) => task.status !== 'completed')
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

generateCalendar() {
  const year = this.currentDate.getFullYear();
  const month = this.currentDate.getMonth();

  this.daysInMonth = [];
  this.startOffset = [];
  this.endOffset = [];

  const numDays = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= numDays; i++) {
    this.daysInMonth.push(i);
  }

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const offsetCount = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = offsetCount - 1; i >= 0; i--) {
    this.startOffset.push(prevMonthLastDay - i);
  }

  const totalSlots = 42; 
  const remainingSlots = totalSlots - (this.startOffset.length + this.daysInMonth.length);
  for (let i = 1; i <= remainingSlots; i++) {
    this.endOffset.push(i);
  }
}

  hasDeadline(day: number): boolean {
    return this.allTasksForCalendar.some(task => {
      if (!task.deadline) return false;
      const d = new Date(task.deadline);
      return d.getDate() === day && 
            d.getMonth() === this.currentDate.getMonth() && 
            d.getFullYear() === this.currentDate.getFullYear();
    });
  }

  isToday(day: number): boolean {
    const now = new Date();
    return day === now.getDate() && 
          this.currentDate.getMonth() === now.getMonth() && 
          this.currentDate.getFullYear() === now.getFullYear();
  }

getTasksThisWeek(): number {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  return this.allTasksForCalendar.filter(task => {
    if (!task.deadline) return false;
    const d = new Date(task.deadline);
    return d >= now && d <= nextWeek;
  }).length;
}

  changeMonth(delta: number) {
    const newMonth = this.currentDate.getMonth() + delta;
    this.currentDate = new Date(this.currentDate.getFullYear(), newMonth, 1);
    this.generateCalendar();
  }

  // Acivity log
  loadActivities() {
    this.activityService.getAllActivities().subscribe({
      next: (res) => {
        const allACtivities = res.activities || [];

        console.log('Loaded activities:', res.activities);
        this.activities = allACtivities.slice(0, 5);
      },
      error: (err) => {
        console.error('Error loading activities:', err);
      }
    });
  }
}
