import { Component } from '@angular/core';
import { UpperCasePipe } from '@angular/common';

interface RoadmapMilestone {
  id: number;
  name: string;
  goalId: string; // Links to a goal/section
  phase: string; // Flexible phase type (phase1-4, design/backend/frontend/testing, etc.)
  assignee: string;
  deadline: string;
  status: 'completed' | 'in-progress' | 'pending';
  description?: string;
  dependencies?: number[]; // IDs of milestones this depends on
}

interface RoadmapGoal {
  id: string;
  name: string;
  color: string;
  description?: string;
}

interface TodoTask {
  id: number;
  title: string;
  description: string;
  goalId: string; // Links to ToDo section (frontend/backend/testing/documentation)
  milestoneId?: number; // Links to RoadmapMilestone
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'completed' | 'in-progress' | 'pending';
}

@Component({
  selector: 'app-project-dashboard',
  imports: [UpperCasePipe],
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.css'
})
export class ProjectDashboardComponent {
  activeTab: string = 'MainPage';
  selectedCategory: string | null = null;
  selectedMilestoneFilter: number | null = null;

  // Roadmap state
  selectedTask: RoadmapMilestone | null = null;
  hoveredTask: RoadmapMilestone | null = null;
  showTaskModal = false;
  tooltipPosition = { x: 0, y: 0 };
  currentDate = new Date();
  
  // Drag & Drop state
  draggedTask: RoadmapMilestone | null = null;
  dragStartX = 0;
  dragStartLeft = 0;
  isDragging = false;
  
  // Resize state
  resizingTask: RoadmapMilestone | null = null;
  resizeStartX = 0;
  resizeStartWidth = 0;
  resizeMode: 'left' | 'right' | null = null;
  
  // Context menu state
  showContextMenu = false;
  contextMenuTask: RoadmapMilestone | null = null;
  contextMenuPosition = { x: 0, y: 0 };
  
  // Highlighted dependencies
  highlightedTasks: Set<number> = new Set();

  // Roadmap structure: Work Type Based
  phases = ['phase1', 'phase2', 'phase3', 'phase4'];
  phaseLabels: { [key: string]: string } = {
    'phase1': 'Phase 1',
    'phase2': 'Phase 2',
    'phase3': 'Phase 3',
    'phase4': 'Phase 4'
  };

  goals: RoadmapGoal[] = [
    { id: 'frontend', name: 'Frontend Development', color: '#4a9eff', description: 'Frontend development work' },
    { id: 'backend', name: 'Backend Development', color: '#2ecc71', description: 'Backend development work' },
    { id: 'design', name: 'Design', color: '#9b59b6', description: 'UI/UX design work' },
    { id: 'testing', name: 'Testing & QA', color: '#f39c12', description: 'Testing and quality assurance' },
    { id: 'devops', name: 'DevOps', color: '#e74c3c', description: 'Infrastructure and deployment' }
  ];

  roadmapMilestones: RoadmapMilestone[] = [
    // Frontend Development
    { id: 101, name: 'Login System', goalId: 'frontend', phase: 'phase1', assignee: 'John', deadline: 'Feb 2026', status: 'completed', description: 'Create login page with validation' },
    { id: 102, name: 'Dashboard UI', goalId: 'frontend', phase: 'phase2', assignee: 'Sarah', deadline: 'Mar 2026', status: 'in-progress', description: 'Build dashboard interface' },
    { id: 103, name: 'User Profile', goalId: 'frontend', phase: 'phase2', assignee: 'Mike', deadline: 'Mar 2026', status: 'pending', description: 'User profile page' },
    { id: 104, name: 'Reports Page', goalId: 'frontend', phase: 'phase3', assignee: 'Anna', deadline: 'Apr 2026', status: 'pending', description: 'Create reports interface' },
    
    // Backend Development
    { id: 201, name: 'Auth API', goalId: 'backend', phase: 'phase1', assignee: 'Tom', deadline: 'Feb 2026', status: 'completed', description: 'Authentication endpoints' },
    { id: 202, name: 'User API', goalId: 'backend', phase: 'phase2', assignee: 'Lisa', deadline: 'Mar 2026', status: 'in-progress', description: 'User management API' },
    { id: 203, name: 'Data API', goalId: 'backend', phase: 'phase2', assignee: 'David', deadline: 'Mar 2026', status: 'pending', description: 'Data processing endpoints' },
    
    // Design
    { id: 301, name: 'Wireframes', goalId: 'design', phase: 'phase1', assignee: 'Emma', deadline: 'Feb 2026', status: 'completed', description: 'Initial wireframes' },
    { id: 302, name: 'UI Components', goalId: 'design', phase: 'phase2', assignee: 'Emma', deadline: 'Mar 2026', status: 'in-progress', description: 'Design system components' },
    
    // Testing
    { id: 401, name: 'Unit Tests', goalId: 'testing', phase: 'phase3', assignee: 'Chris', deadline: 'Apr 2026', status: 'pending', description: 'Write unit tests' },
    { id: 402, name: 'Integration Tests', goalId: 'testing', phase: 'phase4', assignee: 'Chris', deadline: 'May 2026', status: 'pending', description: 'Integration testing' },
    
    // DevOps
    { id: 501, name: 'CI/CD Setup', goalId: 'devops', phase: 'phase1', assignee: 'Kevin', deadline: 'Feb 2026', status: 'completed', description: 'Setup pipelines' },
    { id: 502, name: 'Production Deploy', goalId: 'devops', phase: 'phase4', assignee: 'Kevin', deadline: 'May 2026', status: 'pending', description: 'Deploy to production' }
  ];

  // TODO Tasks linked to milestones
  todoTasks: TodoTask[] = [
    // Frontend tasks
    { id: 1, title: 'Create login page', description: 'Implement authentication UI with form validation', goalId: 'frontend', milestoneId: 101, priority: 'high', dueDate: 'Jan 25', status: 'completed' },
    { id: 2, title: 'Build dashboard components', description: 'Design and implement main dashboard with statistics', goalId: 'frontend', milestoneId: 102, priority: 'medium', dueDate: 'Jan 30', status: 'in-progress' },
    { id: 3, title: 'Responsive design implementation', description: 'Make all pages mobile-friendly', goalId: 'frontend', milestoneId: 103, priority: 'low', dueDate: 'Feb 5', status: 'pending' },
    
    // Backend tasks
    { id: 4, title: 'Setup API endpoints', description: 'Create RESTful API for user management', goalId: 'backend', milestoneId: 202, priority: 'high', dueDate: 'Jan 28', status: 'in-progress' },
    { id: 5, title: 'Database schema design', description: 'Design normalized database structure', goalId: 'backend', milestoneId: 203, priority: 'medium', dueDate: 'Feb 2', status: 'pending' },
    
    // Testing tasks
    { id: 6, title: 'Write unit tests', description: 'Create test cases for core components', goalId: 'testing', milestoneId: 401, priority: 'medium', dueDate: 'Feb 10', status: 'pending' },
    { id: 7, title: 'Integration testing', description: 'Test API integration with frontend', goalId: 'testing', milestoneId: 402, priority: 'low', dueDate: 'Feb 15', status: 'pending' },
    
    // Documentation tasks
    { id: 8, title: 'API documentation', description: 'Document all API endpoints and responses', goalId: 'documentation', priority: 'high', dueDate: 'Jan 31', status: 'in-progress' },
    { id: 9, title: 'User manual', description: 'Write comprehensive user guide', goalId: 'documentation', priority: 'medium', dueDate: 'Feb 20', status: 'pending' }
  ];



  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.selectedCategory = null;
  }

  selectCategory(category: string | null) {
    this.selectedCategory = this.selectedCategory === category ? null : category;
    this.clearMilestoneFilter(); // Clear filter when switching categories
  }

  getMilestonesByGoalAndPhase(goalId: string, phase: string): RoadmapMilestone[] {
    return this.roadmapMilestones.filter(m => m.goalId === goalId && m.phase === phase);
  }

  getTasksByGoal(goalId: string): TodoTask[] {
    let tasks = this.todoTasks.filter(t => t.goalId === goalId);
    
    // Apply milestone filter if selected
    if (this.selectedMilestoneFilter !== null) {
      tasks = tasks.filter(t => t.milestoneId === this.selectedMilestoneFilter);
    }
    
    return tasks;
  }

  getMilestoneName(milestoneId?: number): string {
    if (!milestoneId) return 'No milestone';
    const milestone = this.roadmapMilestones.find(m => m.id === milestoneId);
    return milestone ? milestone.name : 'Unknown milestone';
  }

  getMilestonesByGoal(goalId: string): RoadmapMilestone[] {
    // Get milestones that have tasks in this goal
    const tasksInGoal = this.todoTasks.filter(t => t.goalId === goalId && t.milestoneId);
    const milestoneIds = new Set(tasksInGoal.map(t => t.milestoneId!));
    return this.roadmapMilestones.filter(m => milestoneIds.has(m.id));
  }

  setMilestoneFilter(milestoneId: number | null) {
    this.selectedMilestoneFilter = milestoneId;
  }

  clearMilestoneFilter() {
    this.selectedMilestoneFilter = null;
  }

  // Task interaction methods
  getTasksByCategory(category: string): RoadmapMilestone[] {
    return this.roadmapMilestones.filter(m => m.goalId === category);
  }

  onTaskClick(task: RoadmapMilestone, event: MouseEvent) {
    this.selectedTask = task;
    this.showTaskModal = true;
  }

  onTaskHover(task: RoadmapMilestone, event: MouseEvent) {
    this.hoveredTask = task;
    this.tooltipPosition = { x: event.clientX + 10, y: event.clientY + 10 };
    this.highlightRelatedTasks(task);
  }

  onTaskLeave() {
    this.hoveredTask = null;
    this.highlightedTasks.clear();
  }

  onTaskMouseDown(task: RoadmapMilestone, event: MouseEvent | DragEvent) {
    this.draggedTask = task;
    this.isDragging = true;
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent) {
    // Simple drag cursor update
  }

  onMouseUp() {
    this.isDragging = false;
    this.draggedTask = null;
  }

  // Drop handler for grid cells
  onCellDrop(goalId: string, phase: string, event: DragEvent) {
    event.preventDefault();
    if (this.draggedTask) {
      this.draggedTask.goalId = goalId;
      this.draggedTask.phase = phase as any;
      this.draggedTask = null;
      this.isDragging = false;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Context menu methods
  onTaskContextMenu(task: RoadmapMilestone, event: MouseEvent) {
    event.preventDefault();
    this.contextMenuTask = task;
    this.showContextMenu = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
  }

  closeContextMenu() {
    this.showContextMenu = false;
    this.contextMenuTask = null;
  }

  markTaskComplete(task: RoadmapMilestone) {
    task.status = 'completed';
    this.closeContextMenu();
  }

  editTask(task: RoadmapMilestone) {
    this.selectedTask = task;
    this.showTaskModal = true;
    this.closeContextMenu();
  }

  deleteTask(task: RoadmapMilestone) {
    const index = this.roadmapMilestones.indexOf(task);
    if (index > -1) {
      this.roadmapMilestones.splice(index, 1);
    }
    this.closeContextMenu();
  }

  duplicateTask(task: RoadmapMilestone) {
    const newTask: RoadmapMilestone = {
      ...task,
      id: Math.max(...this.roadmapMilestones.map(t => t.id)) + 1,
      name: task.name + ' (Copy)',
      status: 'pending'
    };
    this.roadmapMilestones.push(newTask);
    this.closeContextMenu();
  }

  // Double-click to create new task in grid cell
  onCellDoubleClick(goalId: string, phase: string, event: MouseEvent) {
    const newTask: RoadmapMilestone = {
      id: Math.max(...this.roadmapMilestones.map(t => t.id)) + 1,
      name: 'New Milestone',
      goalId: goalId,
      phase: phase as any,
      assignee: 'Unassigned',
      deadline: 'TBD',
      status: 'pending',
      description: 'Click to edit'
    };
    this.roadmapMilestones.push(newTask);
  }

  // Highlight related tasks (dependencies)
  highlightRelatedTasks(task: RoadmapMilestone) {
    this.highlightedTasks.clear();
    this.roadmapMilestones.forEach(t => {
      if (t.dependencies && t.dependencies.includes(task.id)) {
        this.highlightedTasks.add(t.id);
      }
    });
  }

  isTaskHighlighted(task: RoadmapMilestone): boolean {
    return this.highlightedTasks.has(task.id);
  }

  closeTaskModal() {
    this.showTaskModal = false;
    this.selectedTask = null;
  }

  // Get current date position on timeline (percentage)
  getCurrentDatePosition(): number {
    const startDate = new Date(2025, 9, 1); // Oct 1, 2025
    const endDate = new Date(2026, 4, 31); // May 31, 2026
    const current = this.currentDate;
    
    const totalTime = endDate.getTime() - startDate.getTime();
    const elapsedTime = current.getTime() - startDate.getTime();
    
    return Math.max(0, Math.min(100, (elapsedTime / totalTime) * 100));
  }
}
