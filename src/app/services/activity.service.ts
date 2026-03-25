import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(
        private http: HttpClient, 
        @Inject(PLATFORM_ID) private platformId: Object
    ) { } 

    getProjectActivities(projectId: number): Observable<any> {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            throw new Error('No token found');
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
        });

        return this.http.get(`${this.apiUrl}/activities/${projectId}`, { headers });
    }

    getAllActivities(): Observable<any> {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            throw new Error('No token found');
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
        });

        return this.http.get(`${this.apiUrl}/allActivities`, { headers });
    }

    logActivity(action: string, projectId: number): Observable<any> {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            throw new Error('No token found');
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
        });

        return this.http.post(`${this.apiUrl}/activities`, { action, projectId }, { headers });
    }
}