import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
    private apiUrl = 'http://localhost:3000/api';

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

    getTechnologies(): Observable<any> {
        return this.http.get(`${this.apiUrl}/technology`);
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
        return this.http.post(`${this.apiUrl}/projects`, { data, deadline }, { headers });
    }
}