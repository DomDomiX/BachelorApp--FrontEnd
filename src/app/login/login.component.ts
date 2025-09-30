import {Component} from '@angular/core';
import {TuiButton} from '@taiga-ui/core';
import {FormsModule} from '@angular/forms';
import {TuiIcon, TuiTextfield} from '@taiga-ui/core';
import {TuiPassword} from '@taiga-ui/kit';

@Component({
  selector: 'app-login',
  imports: [TuiButton, TuiTextfield, FormsModule, TuiIcon, TuiPassword],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
}
