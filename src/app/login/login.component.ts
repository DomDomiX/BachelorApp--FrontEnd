import { Component } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiPassword } from '@taiga-ui/kit';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [TuiButton, TuiTextfield, FormsModule, TuiIcon, TuiPassword],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  email = '';
  password = '';
  isRegistering = false;
  loggedIn: boolean = false;

  changeForm() {
    this.isRegistering = !this.isRegistering;
  }

  constructor(public router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  register() {
    if (this.username.trim() === '' || this.email.trim() === '' || this.password.trim() === '') {
      alert('Please fill in all fields');
      return;
    }


    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        console.log("Registrace úspěšná:", res);
        this.changeForm();
        this.loggedIn = true;
      },
      error: (err) => {
        console.error("Chyba při registraci:", err);
        const serverMsg = err?.error?.error || err?.error?.message || err?.message || 'Unknown error';
        alert(serverMsg);
      }
    });
  }

  login() {
    if (!this.isRegistering) {
      this.authService.login({
        email: this.email,
        password: this.password
      }).subscribe({
        next: (res) => {
          console.log('Login successful:', res);
          localStorage.setItem("accessToken", res.accessToken);
          this.loggedIn = true;
          this.router.navigate(['/dashboard']).then(() => {
            window.location.reload();
          });
        },
        error: (err) => {
          console.error('Login failed', err);
          const serverMsg = err?.error?.error || err?.error?.message || err?.message || 'Unknown error';
          alert(serverMsg);
        }
      })
    }
  }
}
