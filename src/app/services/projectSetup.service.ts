import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProjectSetupService {
    private apiUrl = 'http://localhost:3000/api';
    private apiTech = 'http://localhost:3000/api/public';

    constructor(
        private http: HttpClient, 
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    // TODO: addSection(Name, Icon, Color)
    addSection(data: {projectId: number, name: string, icon: number, color: string}): Observable<any> {
      const token = localStorage.getItem('accessToken');
      console.log('Načtený token pro vytvoření sekce:', token);

      if (!token) {
        throw new Error('No token found');
      }

      const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
      });

      console.log('Posílaná hlavička pro vytvoření sekce:', headers.get('Authorization'));
      return this.http.post(`${this.apiUrl}/create-section`, data, { headers });
    }

    loadSections(projectId: number): Observable<any> {
      const token = localStorage.getItem('accessToken');
      console.log('Načtený token pro načtení sekcí:', token);

      if (!token) {
        throw new Error('No token found');
      }

      const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
      });

      return this.http.get(`${this.apiUrl}/sections/${projectId}`, { headers });
    }

    // TODO: deleteSection()
    deleteSection(sectionId: number): Observable<any> {
      const token = localStorage.getItem('accessToken');
      console.log('Načtený token pro smazání sekce:', token);

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      });

      return this.http.delete(`${this.apiUrl}/delete-section/${sectionId}`, { headers });
    }

    // TODO: addMilestone(Name, Description)
    addMilestone(data: {name: string, description: string}, projectId: number): Observable<any> {
      const token = localStorage.getItem('accessToken');
      console.log('Načtený token pro vytvoření milníku:', token);
        
      if (!token) {
        throw new Error('No token found');
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      });

      console.log('Posílaná hlavička pro vytvoření milníku:', headers.get('Authorization'));
      return this.http.post(`${this.apiUrl}/create-milestone/${projectId}`, { data }, { headers });
    }

    // TODO: deleteMilestone()
    deleteMilestone(milestoneId: number): Observable<any> {
      const token = localStorage.getItem('accessToken');
      console.log('Načtený token pro smazání milníku:', token);

      if (!token) {
        throw new Error('No token found');
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      });

      return this.http.delete(`${this.apiUrl}/delete-milestone/${milestoneId}`, { headers });
    }

    // TODO: Nacteni RoadMapy
    getRoadmap(projectId: number): Observable<any> {
      const token = localStorage.getItem('accessToken');
      console.log('Načtený token pro načtení roadmapy:', token);

      if (!token) {
        throw new Error('No token found');
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      });

      return this.http.get(`${this.apiUrl}/roadmap/${projectId}`, { headers });
    }
}