import { Component, OnInit } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { ProjectService } from '../services/project.service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

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

  // Edit status modal
  editingProject: any = null;
  newStatus: string = '';
  availableStatuses: string[] = ['planning', 'active', 'completed', 'on-hold'];

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.loadTechnologies();
    this.loadProjects(); // Technologie pro projekty se načtou automaticky
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
        this.closeEditStatusModal();
        alert('Project status updated successfully!');
      },
      error: (error) => {
        console.error('Error updating status:', error);
        alert('Failed to update project status');
      }
    });
  }

  loadProjects() {
    this.projectService.getUserProjects().subscribe({
      next: (res) => {
        this.projects = res.projects;
        this.loading = false;
        console.log('Loaded projects:', this.projects);
        
        // Načti technologie pro každý projekt
        this.projects.forEach(project => {
          this.loadProjectTechnologies(project.id, project);
        });
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.error = 'Nepodařilo se načíst projekty';
        this.projects = [];
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
        this.toggleCreateForm();
        // TODO: Refresh project list
      },
      error: (error) => {
        console.error('Error creating project:', error);
        alert('Failed to create project: ' + (error.error?.error || error.message));
      }
    });
  }
}

