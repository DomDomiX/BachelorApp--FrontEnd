import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-setup',
  imports: [CommonModule, FormsModule],
  templateUrl: './project-setup.component.html',
  styleUrl: './project-setup.component.css'
})
export class ProjectSetupComponent {
  // Available icons for sections
  availableIcons = ['💻', '⚙️', '🎨', '🧪', '📝', '🗄️', '🔧', '🌐', '📊', '🔐', '📱', '☁️'];
  availableColors = ['#4a9eff', '#2ecc71', '#9b59b6', '#f39c12', '#e67e22', '#e74c3c', '#1abc9c', '#3498db'];

  phases = ['phase1', 'phase2', 'phase3', 'phase4'];
  phaseLabels: any = {
    'phase1': 'Phase 1',
    'phase2': 'Phase 2', 
    'phase3': 'Phase 3',
    'phase4': 'Phase 4'
  };

  // Project Info - TODO: Načítat z DB podle projectId
  projectInfo = {
    name: 'Můj Projekt', // TODO: Z databáze
    description: 'Popis projektu...', // TODO: Z databáze
    deadline: new Date(), // TODO: Z databáze
    technologies: ['React', 'Node.js'], // TODO: Z databáze
    status: 'planning' // TODO: Z databáze
  };

  // Data structure
  sections: any[] = []; // User-created sections
  milestones: any[] = [];

  // UI State
  selectedSection: string | null = null;
  showAddSection = false;
  showAddMilestone = false;
  newSection = { name: '', icon: '💻', color: '#4a9eff' };
  newMilestone = { name: '', sectionId: '', phase: 'phase1', description: '' };

  constructor(private router: Router) {}

  // TODO: ngOnInit - načíst projectInfo, sections a milestones z DB podle projectId

  // Section management
  toggleAddSection() {
    this.showAddSection = !this.showAddSection;
    if (!this.showAddSection) this.newSection = { name: '', icon: '💻', color: '#4a9eff' };
  }

  addSection() {
    // TODO: Service metoda - createSection() pro uložení do DB
    if (!this.newSection.name.trim()) return;
    this.sections.push({
      id: Date.now().toString(),
      ...this.newSection
    });
    this.toggleAddSection();
  }

  deleteSection(sectionId: string) {
    // TODO: Service metoda - deleteSection() pro smazání z DB
    if (confirm('Smazat sekci i všechny milestones v ní?')) {
      this.sections = this.sections.filter(s => s.id !== sectionId);
      this.milestones = this.milestones.filter(m => m.sectionId !== sectionId);
    }
  }

  selectSection(sectionId: string) {
    this.selectedSection = this.selectedSection === sectionId ? null : sectionId;
  }

  getSectionMilestones(sectionId: string) {
    return this.milestones.filter(m => m.sectionId === sectionId);
  }

  getMilestonesBySectionAndPhase(sectionId: string, phase: string) {
    return this.milestones.filter(m => m.sectionId === sectionId && m.phase === phase);
  }

  onCellDoubleClick(sectionId: string, phase: string) {
    this.newMilestone.sectionId = sectionId;
    this.newMilestone.phase = phase;
    this.showAddMilestone = true;
  }

  // Milestones
  toggleAddMilestone(sectionId: string) {
    if (this.showAddMilestone && this.newMilestone.sectionId === sectionId) {
      this.showAddMilestone = false;
      this.resetMilestoneForm();
    } else {
      this.showAddMilestone = true;
      this.newMilestone.sectionId = sectionId;
    }
  }

  addMilestone() {
    // TODO: Service metoda - createMilestone() pro uložení do DB
    if (!this.newMilestone.name.trim()) return;
    this.milestones.push({
      id: Date.now(),
      ...this.newMilestone,
      status: 'pending'
    });
    this.showAddMilestone = false;
    this.resetMilestoneForm();
  }

  deleteMilestone(id: number) {
    // TODO: Service metoda - deleteMilestone() pro smazání z DB
    this.milestones = this.milestones.filter(m => m.id !== id);
  }

  resetMilestoneForm() {
    this.newMilestone = { name: '', sectionId: '', phase: 'phase1', description: '' };
  }

  // Actions
  finishSetup() {
    // TODO: Service metoda - (volitelně) updateProjectStatus() pro update statusu projektu
    if (this.sections.length === 0) {
      alert('Vytvoř alespoň jednu sekci projektu!');
      return;
    }
    console.log('Sections:', this.sections);
    console.log('Milestones:', this.milestones);
    alert('Projekt připraven!');
    this.router.navigate(['/projectDashboard']);
  }

  skipSetup() {
    if (confirm('Přeskočit nastavení?')) this.router.navigate(['/projectDashboard']);
  }
}
