import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
    private apiUrl = 'http://localhost:3000/api';
    private apiTech = 'http://localhost:3000/api/public';

    constructor(
        private http: HttpClient, 
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }  
    
    getUserProjects(): Observable<any> {
        const token = localStorage.getItem('accessToken');
        console.log('Načtený token:', token);
        
        if (!token) {
            throw new Error('No token found');
        }
        
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
        });
        
        console.log('Posílaná hlavička:', headers.get('Authorization'));
        return this.http.get(`${this.apiUrl}/projects`, { headers });
    }

    getProjectById(projectId: number): Observable<any> {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            throw new Error('No token found');
        }
        
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
        });
        
        return this.http.get(`${this.apiUrl}/projects/${projectId}`, { headers });
    }

    getTechnologies(): Observable<any> {
        return this.http.get(`${this.apiTech}/technology`);
    }

    getProjectTechnologies(projectId: number): Observable<any> { 
        return this.http.get(`${this.apiTech}/projectTechnologies?projectId=${projectId}`);
    }

    createProject(data: {name: string, description: string, technologies: string[], status: string, progress: number}, deadline: Date): Observable<any> {
        const token = localStorage.getItem('accessToken');
        console.log('Načtený token pro vytvoření projektu:', token);

        if (!token) {
            throw new Error('No token found');
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
        });

        console.log('Posílaná hlavička:', headers.get('Authorization'));
        return this.http.post(`${this.apiUrl}/create-project`, { data, deadline }, { headers });
    }

    updateProjectStatus(projectId: number, status: string): Observable<any> {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            throw new Error('No token found');
        }
        
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
        });
        
        return this.http.patch(`${this.apiUrl}/projects/${projectId}/status`, { status }, { headers });
    }

    deleteProject(projectId: number): Observable<any> {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            throw new Error('No token found');
        }
        
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
        });
        
        return this.http.delete(`${this.apiUrl}/projects/${projectId}`, { headers });
    }

    // Tasks

    getTasksByProject(projectId: number): Observable<any> {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            throw new Error('No token found');
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
        });

        // backend exposes tasks at /api/tasks?projectId=<id>
        return this.http.get(`${this.apiUrl}/tasks?projectId=${projectId}`, { headers });
    }

    addTask(taskData: { projectId: number, title: string, description: string, status: string, priority: string, deadline: Date | null, sectionId: number | null, milestoneId: number }): Observable<any> {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            throw new Error('No token found');
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
        });

        return this.http.post(`${this.apiUrl}/create-task`, taskData, { headers });
    }

    deleteTask(taskId: number, projectId: number): Observable<any> {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            throw new Error('No token found');
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
        });
        
        return this.http.delete(`${this.apiUrl}/delete-task/${taskId}?projectId=${projectId}`, { headers });
    }
}