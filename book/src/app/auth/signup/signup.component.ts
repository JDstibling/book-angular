import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm! : FormGroup;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    //initialisation du formGroup
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      // le validator pattern prend un argument afin d'imposer une chaine de caractère de type alphanumérique avec 6
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
    })
  }

  onSubmit() {
    const email = this.signUpForm.get('email')?.value;
    const password = this.signUpForm.get('password')?.value;
    this.authService.createNewUser(email, password).then(
      () => {
        this.router.navigate(['/books']);
        console.log('création d\'un utilisateur réussis !');
      },
      (error) => {
        this.errorMessage = error;
        console.log('L\'enregistrement a échoué !' + error);
      }

    )
  }

}
