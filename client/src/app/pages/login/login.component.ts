import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  message: string;
  messageClass: string;
  formLock = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.createForm()
  }

  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required], // Username field
      password: ['', Validators.required] // Password field
    });
  }


  onLoginSubmit() {
    this.formLock = true; // Used to submit button while is being processed
    const user = {
      username: this.form.get('username').value, // Username input field
      password: this.form.get('password').value // Password input field
    }

    this.authService.login(user).subscribe(res => {
      if (!res.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = res.message; // Set error message
        this.formLock = false; // Enable submit button
      }
      else {
        this.messageClass = 'alert alert-success'; // Set bootstrap success class
        this.message = res.message; // Set success message
        this.authService.storeUserData(res.token, res.user);
        setTimeout(() => {
          this.router.navigate(['/dashboard']); // Navigate to dashboard view
        }, 2000);
      }
    });
  }

  ngOnInit() {
  }

}
