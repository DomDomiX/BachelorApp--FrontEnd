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

    // TODO: addSection(Name, Icon, Color)
    // TODO: deleteSection()
    // TODO: addMilestone(Name, Description)
    // TODO: deleteMilestone()
    // TODO: Nacteni RoadMapy
}