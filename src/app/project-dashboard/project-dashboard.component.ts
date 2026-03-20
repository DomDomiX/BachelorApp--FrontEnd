import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { ProjectSetupService } from '../services/projectSetup.service';

@Component({
  selector: 'app-project-dashboard',
  imports: [FormsModule],
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.css'
})
export class ProjectDashboardComponent implements OnInit {
  projectId: number | null = null;
  loading: boolean = true;

  activeTab: string = 'MainPage';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Available icons for sections
  availableIcons = ['💻', '⚙️', '🎨', '🧪', '📝', '🗄️', '🔧', '🌐', '📊', '🔐', '📱', '☁️'];
  availableColors = ['#4a9eff', '#2ecc71', '#9b59b6', '#f39c12', '#e67e22', '#e74c3c', '#1abc9c', '#3498db'];

  phases = [0, 1, 2, 3];
  phaseLabels: string[] = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'];

  goals = [];

  // Project Info
  projectInfo = {
    name: '',
    description: '', 
    deadline: new Date(), 
    technologies: [], 
    status: 'Active' 
  };

  // Data structure
  sections: any[] = []; // User-created sections
  milestones: any[] = [];

  // Sections
  selectedSection: string | null = null;
  showAddSection = false;
  showAddMilestone = false;
  sectionName: string = '';
  sectionIcon: string = '💻';
  sectionColor: string = '#4a9eff';

  // Milestones
  milestoneName: string = '';
  milestoneDescription: string = '';
  milestonePhase: number = this.phases[0];
  milestoneSectionId: string = '';

  // Roadmap logic (stejné jako project-setup)
  selectedCategory: number | null = null;
  selectedMilestoneFilter: string | null = null;
  
  draggedTask: any = null;
  contextMenuPosition = { x: 0, y: 0 };
  contextMenuTask: any = null;
  tooltipPosition = { x: 0, y: 0 };
  hoveredTask: any = null;
  selectedTask: any = null;

  // Tasks
  tasks: any[] = [];
  editingTaskId: number | null = null;

  // New task form fields
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  newTaskPriority: string = 'medium';
  newTaskMilestoneId: any = null;
  newTaskStatus: string = 'pending';
  newTaskSectionId: any = null;
  newTaskDeadline: any = null;
  showAddTask: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private projectService: ProjectService, private projectSetupService: ProjectSetupService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      
      if (this.projectId) {
        this.loadProject();
        this.loadSections();
        this.loadMilestones();
        this.loadTasks();
      }
   
    })
  }

  loadProject() {
    if (!this.projectId) return;

    this.projectService.getProjectById(this.projectId).subscribe({
      next: (res) => {
        const project = res.project;
        this.projectInfo = {
          name: project.name,
          description: project.description,
          deadline: new Date(project.deadline),
          technologies: (project.technologies || []).map((tech: any) => tech.name),
          status: project.status
        };
        this.loading = false;
        console.log('Loaded project: ', this.projectInfo);
      },
      error: (err) => {
        console.error('Error loading project: ', err)
        this.loading = false;
        alert('Failed to load project');
      }
    })
  }

  // Roadmap
  createSection() {
    if (!this.sectionName.trim()) return;

    if (this.projectId === null) {
      alert('Project ID is missing');
      return;
    }

    const sectionData = {
      projectId: this.projectId,
      name: this.sectionName,
      icon: this.availableIcons.indexOf(this.sectionIcon),
      color: this.sectionColor
    };

    console.log('Creating section with data:', sectionData);

    this.projectSetupService.addSection(sectionData).subscribe({
      next: (res) => {
        console.log('Section created successfully:', res);
        alert('Section created successfully!');

        this.loadSections();

        this.sectionColor = '#4a9eff';
        this.sectionIcon = '💻';
        this.sectionName = '';
        this.showAddSection = false;
      },
      error: (err) => {
        console.error('Error creating section:', err);
        alert('Failed to create section');
      } 
    });
  }

  loadSections() {
    if (this.projectId === null) {
      alert('Project ID is missing');
      return;
    }

    this.projectSetupService.loadSections(this.projectId).subscribe({
      next: (res) => {
        this.sections = res.sections || [];
        this.loading = false;
        console.log('Loaded sections:', this.sections);
      },
      error: (err) => {
        console.error('Error loading sections:', err);
        this.sections = [];
        this.loading = false;
      }
    });
  }

  deleteSection(id: number) {
    this.projectSetupService.deleteSection(id).subscribe({
      next: () => {
        this.loadSections();
      },
      error: (err) => {
        console.error('Error deleting section:', err);
        alert('Failed to delete section');
      }
    });
  }

  // Milestones
  createMilestone() {
    if (!this.milestoneName.trim()) return;

    if (this.projectId === null) {
      alert('Project ID is missing');
      return;
    }

    if (!this.milestoneSectionId) {
      alert('Nejprve vyber sekci pro milestone');
      return;
    }

    const milestoneData = {
      projectId: this.projectId,
      sectionId: this.milestoneSectionId,
      name: this.milestoneName,
      description: this.milestoneDescription,
      phase: this.milestonePhase
    };

    console.log('Creating milestone with data:', milestoneData);

    this.projectSetupService.addMilestone(milestoneData).subscribe({
      next: (res) => {
        console.log('Milestone created successfully:', res);
        alert('Milestone created successfully!');
        this.showAddMilestone = false;
        this.resetMilestoneForm();
        this.loadMilestones();
      },
      error: (err) => {
        console.error('Error creating milestone:', err);
        alert('Failed to create milestone');
      } 
    });
  }

  loadMilestones() {
    if (this.projectId === null) {
      alert('Project ID is missing');
      return;
    }

    this.projectSetupService.loadMilestones(this.projectId).subscribe({
      next: (res) => {
        this.milestones = res.milestones || [];
        this.loading = false;
        console.log('Loaded milestones:', this.milestones);
      },
      error: (err) => {
        console.error('Error loading milestones:', err);
        this.milestones = [];
        this.loading = false;
      }
    });
  }

  deleteMilestone(id: number) {
    this.projectSetupService.deleteMilestone(id).subscribe({
      next: () => {
        this.loadMilestones();
      },
      error: (err) => {
        console.error('Error deleting milestone:', err);
        alert('Failed to delete milestone');
      }
    });
  }

  resetMilestoneForm() {
    this.milestoneDescription = '';
    this.milestoneName = '';
    this.milestonePhase = this.phases[0];
    this.milestoneSectionId = '';
  }

  getSectionMilestones(sectionId: number | null) {
    return this.milestones.filter(m => {
      const milestoneSectionId = m.sectionId ?? m.sectionid;
      return milestoneSectionId === sectionId;
    });
  }

  getMilestonesBySectionAndPhase(sectionId: string, phase: number) {
    return this.milestones.filter(m => {
      const milestoneSectionId = m.sectionId ?? m.sectionid;
      return String(milestoneSectionId) === String(sectionId) && Number(m.phase) === phase;
    });
  }

  toggleAddSection() {
    this.showAddSection = !this.showAddSection;
    if (!this.showAddSection) this.sectionName = '';
  }

  toggleAddMilestone(sectionId: string) {
    if (this.showAddMilestone && this.milestoneSectionId === sectionId) {
      this.showAddMilestone = false;
      this.resetMilestoneForm();
    } else {
      this.milestoneSectionId = sectionId;
      this.showAddMilestone = true;
    }
  }

  onCellDoubleClick(sectionId: string, phase: number, event?: any) {
    this.milestoneSectionId = String(sectionId);
    this.milestonePhase = phase;
    this.showAddMilestone = true;
  }

  getSectionById(id: number | null) {
    return this.sections.find(s => s.id === id);
  }

  getIconByIndex(index: number) {
    return this.availableIcons[index] || '❓';
  }

   selectCategory(id: number | null) { 
    // set selectedCategory so the tasks detail view opens
    this.selectedCategory = id; 
    // also set newTaskSectionId so Add Task uses current section
    this.newTaskSectionId = id; 
  }

  // Tasks
  loadTasks() {
    if (this.projectId == null) return;
    this.projectService.getTasksByProject(this.projectId).subscribe({
      next: (res) => {
        // backend returns { tasks: [...] } — handle both shapes
        this.tasks = (res && (res.tasks || res)) || [];
        console.log('Loaded tasks:', this.tasks);
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.tasks = [];
      }
    });
  }

  getTasksBySection(sectionId: number, milestoneId: string | null = null): any[] {
    return this.tasks.filter(task => {
      const matchesSection = task.sectionid === sectionId;
      const matchesMilestone = milestoneId ? String(task.milestoneid) === String(milestoneId) : true;
      return matchesSection && matchesMilestone;
    });
  }

  countTasksByStatus(sectionId: number, status: string): number {
    return this.tasks.filter(task => 
      task.sectionid === sectionId && task.status === status
    ).length;
  }

  // Add new task
  addTask() {
    if (!this.newTaskTitle.trim()) {
      alert('Zadej název úkolu');
      return;
    }

    this.newTaskSectionId = this.selectedCategory;

    if (this.projectId == null) {
      alert('Project ID is missing');
      return;
    }

    const taskData = {
      projectId: this.projectId,
      title: this.newTaskTitle,
      description: this.newTaskDescription,
      priority: this.newTaskPriority,
      milestoneId: this.newTaskMilestoneId,
      status: this.newTaskStatus,
      sectionId: this.newTaskSectionId,
      deadline: this.newTaskDeadline
    }

    console.log('Adding task with data:', taskData);

    this.projectService.addTask(taskData).subscribe({
      next: (res) => {
        console.log('Task added successfully:', res);
        alert('Task added successfully!');

        this.loadTasks();

        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.newTaskPriority = 'medium';
        this.newTaskMilestoneId = null;
        this.newTaskStatus = 'pending';
        this.newTaskSectionId = null;
        this.newTaskDeadline = null;
        this.showAddTask = false;
      }
    });
  }

  toggleAddTaskForm() {
    if (this.showAddTask) {
      this.cancelTaskOperation();
    } else {
      this.editingTaskId = null;
      this.cancelTaskOperation();
      this.showAddTask = true;
    }
  }

  closeTaskModal() { 
    this.selectedTask = null; 
  }

  deleteTask(taskId: number) {
    if (this.projectId == null) {
      alert('Project ID is missing');
      return;
    }

    this.projectService.deleteTask(taskId, this.projectId).subscribe({
      next: () => {
        alert('Task deleted successfully');
        this.loadTasks();
      }
    });
  }

  editTask() {
  if (!this.editingTaskId || !this.newTaskTitle.trim()) return;

  const updateData = {
    title: this.newTaskTitle,
    description: this.newTaskDescription,
    status: this.newTaskStatus,
    priority: this.newTaskPriority,
    deadline: this.newTaskDeadline,
    sectionId: this.selectedCategory as number, 
    milestoneId: this.newTaskMilestoneId as number
  };

  // Nyní už by TypeScript neměl hlásit chybu
  this.projectService.editTask(this.editingTaskId, updateData, this.projectId as number).subscribe({
    next: () => {
      alert('Úkol upraven!');
      this.loadTasks();
      this.cancelTaskOperation();
    },
    error: (err) => {
      console.error('Error updating task:', err);
      alert('Failed to update task');
    } 
  });
}

  startEditTask(task: any) {
  this.editingTaskId = task.id; 
  this.showAddTask = true;    
  
  this.newTaskTitle = task.title;
  this.newTaskDescription = task.description;
  this.newTaskPriority = task.priority;
  this.newTaskDeadline = task.deadline ? task.deadline.split('T')[0] : null; 
  this.newTaskStatus = task.status;
  this.newTaskMilestoneId = task.milestoneid; 
  this.selectedCategory = task.sectionid;
}

  cancelTaskOperation() {
    this.editingTaskId = null;
    this.showAddTask = false;
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPriority = 'medium';
    this.newTaskMilestoneId = null;
    this.newTaskDeadline = null;
    this.newTaskStatus = 'pending';
  }

  // Stub methods - TODO: implement
  clearMilestoneFilter() { this.selectedMilestoneFilter = null; }
  getMilestonesByGoal(goal: string): any[] { return []; }
  setMilestoneFilter(id: string) { this.selectedMilestoneFilter = id; }
  getTasksByGoal(goal: string): any[] { return []; }
  getMilestoneName(id: string): string { return ''; }
  onCellDrop(goalId: string, phase: number, event: any) {}
  onDragOver(event: any) { event.preventDefault(); }
  getMilestonesByGoalAndPhase(goalId: string, phase: number): any[] { return []; }
  isTaskHighlighted(task: any): boolean { return false; }
  onTaskMouseDown(task: any, event: any) {}
  onTaskClick(task: any, event: any) {}
  onTaskHover(task: any, event: any) {}
  onTaskLeave() {}
  onTaskContextMenu(task: any, event: any) { event.preventDefault(); }
  markTaskComplete(task: any) {}
  duplicateTask(task: any) {}}
