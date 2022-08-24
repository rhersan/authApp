import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';


import { AuthService } from '../../services/auth.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {

  miFormulario: FormGroup = this.fb.group({
    email: ['rhernandez@dev.com', [Validators.required,Validators.email] ],
    password: ['abcd123456', [Validators.required, Validators.minLength(6)] ]
  });

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService) { }

  login(){

    const  {email,password} = this.miFormulario.value;
    if(this.miFormulario.valid){

      this.authService.login(email, password).
          subscribe( ok => {
            if( ok == true ){
              this.router.navigateByUrl('/dashboard');
            }else{
              // TODO: mostrar mensaje de error
              console.log( 'else' );
              Swal.fire('Error',
                  ok,
                  'error'
                );
            }
          });
    }
    
    
  }

}
