import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { ProjectSetupComponent } from './project-setup/project-setup.component';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent},
    { path: 'projects', component: ProjectsComponent},
    { path: 'projectDashboard/:id', component: ProjectDashboardComponent},
    { path: 'projectSetup/:id', component: ProjectSetupComponent}
];
