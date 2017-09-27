import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  message: string;
  messageClass: string;
  formLock = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group(
      {
        email: ['', Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
          this.validateEmail
        ])],
        username: ['', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
          this.validateUsername
        ])],
        password: ['', Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(35),
          this.validatePassword
        ])],
        confirm: ['', Validators.required]
      }, { validator: this.matchingPasswords('password', 'confirm') });
  }


  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null; // Return as valid email
    } else {
      return { 'validateEmail': true } // Return as invalid email
    }
  }

  validateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if (regExp.test(controls.value)) {
      return null; // Return as valid username
    } else {
      return { 'validateUsername': true } // Return as invalid username
    }
  }

  validatePassword(controls) {
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    if (regExp.test(controls.value)) {
      return null; // Return as valid password
    } else {
      return { 'validatePassword': true } // Return as invalid password
    }
  }

  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null; // Return as a match
      } else {
        return { 'matchingPasswords': true } // Return as error: do not match
      }
    }
  }

  onRegisterSubmit() {
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    this.authService.registerUser(user).subscribe(res => {
      if (res.success) {
        this.messageClass = 'alert alert-success';
        this.message = res.message;
        this.formLock = true;

        setTimeout(() => {
          this.router.navigate(['/login']); // Redirect to login view
        }, 2000);
      }
      else {
        this.messageClass = 'alert alert-danger';
        this.message = res.message;
      }
    });
  }

  checkEmail() {
    if(!this.form.get('email').value) return;
    this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
      if (!data.success) {
        this.emailValid = false; // Return email as invalid
        this.emailMessage = data.message; // Return error message
      } else {
        this.emailValid = true; // Return email as valid
        this.emailMessage = data.message; // Return success message
      }
    });
  }

  checkUsername() {
    if(!this.form.get('username').value) return;
    this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
      if (!data.success) {
        this.usernameValid = false; // Return username as invalid
        this.usernameMessage = data.message; // Return error message
      } else {
        this.usernameValid = true; // Return username as valid
        this.usernameMessage = data.message; // Return success message
      }
    });
  }


  ngOnInit() {
  }

}
