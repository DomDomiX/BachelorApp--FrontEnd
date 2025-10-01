import {Component} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {FormsModule} from '@angular/forms';
import {TuiIcon, TuiTextfield} from '@taiga-ui/core';
import {TuiPassword} from '@taiga-ui/kit';
import {AuthService} from '../services/auth.service';
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

  changeForm() {
    this.isRegistering = !this.isRegistering;
  }

  constructor(public router: Router, private route: ActivatedRoute, private authService: AuthService) { }

  register() {
    if (this.isRegistering) {
      this.authService.register({
        username: this.username,
        email: this.email,
        password: this.password
      }).subscribe({
        next: (res) => {
          console.log('Registration successful', res);
          this.changeForm(); 
        },
        error: (err) => {
          console.error('Registration failed', err);
        }
      })
    } 
  }
}
