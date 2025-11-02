import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';    

    constructor(private http: HttpClient) { }

    // Metoda pro registraci uživatele
    register(data: {username: string, email: string, password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, data);
    }

    login(data: {email: string, password: string}): Observable<any> {
      return this.http.post(`${this.apiUrl}/login`, data).pipe(
        tap((response: any) => {
          console.log('User logged in', response);
        })
      );
    }     
}