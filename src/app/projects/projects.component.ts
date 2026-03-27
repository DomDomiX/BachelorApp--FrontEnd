import { Component, OnInit } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { ProjectService } from '../services/project.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ActivityService } from '../services/activity.service';

@Component({
  selector: 'app-projects',
  imports: [TuiButton, FormsModule, DatePipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  showCreateForm: boolean = false;
  showEditStatusModal: boolean = false;
  technologies: any[] = []; 
  selectedTechnologies: string[] = []; 

  projectName: string = '';
  projectDescription: string = '';
  projectDeadline: Date = new Date();
  projectTechnologies: any[] = [];

  projects: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  // Filter
  selectedFilter: string = 'all';

  // Edit status modal
  editingProject: any = null;
  newStatus: string = '';
  availableStatuses: string[] = ['planning', 'active', 'completed', 'on-hold'];

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private activityService: ActivityService
  ) { }

  ngOnInit() {
    this.loadTechnologies();
    this.loadProjects(); 
  }

  activityLog(action: string, projectId: number) {
    this.activityService.logActivity(action, projectId).subscribe({
      next: (res) => {
        console.log('Activity logged successfully:', res);
      },
      error: (err) => {
        console.error('Error logging activity:', err);  
      }
    });
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  get filteredProjects() {
    if (this.selectedFilter === 'archived') {
      return this.projects.filter(p => (p.status || '').toLowerCase() === 'archived');
    }
    
    if (this.selectedFilter === 'all') {
      return this.projects.filter(p => (p.status || '').toLowerCase() !== 'archived');
    }
    return this.projects.filter(p => (p.status || '').toLowerCase() === this.selectedFilter && (p.status || '').toLowerCase() !== 'archived');
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
    console.log('Create form visibility:', this.showCreateForm);
  }

  openEditStatusModal(project: any) {
    this.editingProject = project;
    this.newStatus = project.status || 'planning';
    this.showEditStatusModal = true;
  }

  closeEditStatusModal() {
    this.showEditStatusModal = false;
    this.editingProject = null;
    this.newStatus = '';
  }

  updateStatus() {
    if (!this.editingProject || !this.newStatus) {
      alert('Please select a status');
      return;
    }

    this.projectService.updateProjectStatus(this.editingProject.id, this.newStatus).subscribe({
      next: (res) => {
        console.log('Status updated:', res);
        // Update local project status
        this.editingProject.status = this.newStatus;
        this.activityLog(`Updated project status to "${this.newStatus}"`, this.editingProject.id);
        this.closeEditStatusModal();
        alert('Project status updated successfully!');
      },
      error: (error) => {
        console.error('Error updating status:', error);
        alert('Failed to update project status');
      }
    });
  }

  goToProject(project: any) {
    if (project.status === 'planning') {
    this.router.navigate(['/projectSetup', project.id]);
  } else {
    this.router.navigate(['/projectDashboard', project.id]);
  }
  }

  deleteProject(project: any) {
    if (!confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      return;
    }

    this.projectService.deleteProject(project.id).subscribe({
      next: (response) => {
        console.log('Project deleted:', response);
        // Remove from local array
        this.projects = this.projects.filter(p => p.id !== project.id);
        this.activityLog(`Deleted project "${project.name}"`, project.id);
        alert('Project deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    });
  }

  loadProjects() {
    this.projectService.getUserProjects().subscribe({
      next: (res) => {
        this.projects = res.projects || [];
        this.loading = false;
        console.log('Loaded projects:', this.projects);

        // Načti technologie pro každý projekt (pokud nějaké jsou)
        (this.projects || []).forEach(project => {
          this.loadProjectTechnologies(project.id, project);
        });
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        // Pokud backend vrací 404 (no projects), zobrazíme prázdný seznam místo chybového banneru
        if (error && error.status === 404) {
          this.projects = [];
          this.error = null;
          this.loading = false;
        } else {
          this.error = 'Nepodařilo se načíst projekty';
          this.projects = [];
          this.loading = false;
        }
      }
    });
  }

  loadProjectTechnologies(projectId: number, project: any) {
    this.projectService.getProjectTechnologies(projectId).subscribe({
      next: (res) => {
        const techNames = (res.projectTechnologies || []).map((tech: any) => tech.name);
        project.technologies = techNames;
        console.log(`Loaded technologies for project ${projectId}:`, project.technologies);
      },
      error: (error) => {
        console.error(`Error loading technologies for project ${projectId}:`, error);
        project.technologies = [];
      }
    });
  }

  loadTechnologies() {
    this.projectService.getTechnologies().subscribe({
      next: (res) => {
        this.technologies = res.projects || [];
        console.log('Loaded technologies:', this.technologies);
      },
      error: (error) => {
        console.error('Error loading technologies:', error);
        this.technologies = [];
      }
    });
  }

  toggleSelection(techId: string) {
    if (this.selectedTechnologies.includes(techId)) {
      this.selectedTechnologies = this.selectedTechnologies.filter(t => t !== techId);
    } else {
      this.selectedTechnologies.push(techId);
    }
  }

  isSelected(techId: string) {
    return this.selectedTechnologies.includes(techId);
  }

  createProject() {
    // Validace
    if (!this.projectName || !this.projectDescription || !this.projectDeadline || this.selectedTechnologies.length === 0) {
      alert('Please fill all required fields');
      return;
    }

    const projectData = {
      name: this.projectName,
      description: this.projectDescription,
      technologies: this.selectedTechnologies,
      status: 'planning', 
      progress: 0 
    };

    const deadline = new Date(this.projectDeadline);

    console.log('Creating project with data:', projectData, 'deadline:', deadline);

    this.projectService.createProject(projectData, deadline).subscribe({
      next: (response) => {
        console.log('Project created successfully:', response);
        alert('Project created successfully!');

        const newProjectId = response.projectId;

        if (newProjectId) {
          console.log('Navigating to project setup for project ID:', newProjectId);
          this.router.navigate(['/projectSetup', newProjectId]);
        } else {
          console.error('No project ID returned from createProject response:', response);
          this.loadProjects();
        }

        this.activityLog(`Created project "${this.projectName}"`, response.projectId);

        this.toggleCreateForm();
        // Reset form fields
        this.projectName = '';
        this.projectDescription = '';
        this.projectDeadline = new Date();
        this.selectedTechnologies = [];
        // Navigate to project setup
        this.router.navigate(['/projectSetup']);
      },
      error: (error) => {
        console.error('Error creating project:', error);
        alert('Failed to create project: ' + (error.error?.error || error.message));
      }
    });
  }
}

