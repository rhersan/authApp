import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email] ],
    password: ['', [Validators.required, Validators.minLength(6)] ],
  });

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService) {

  }

  ngOnInit(): void {
  }

  guardar(){
    const {name, email, password } = this.miFormulario.value;
    this.authService.registro(name, email, password)
        .subscribe( ok => {
          
          if(ok == true){
            Swal.fire('Registro Exitoso',
                      'Se ha creado el usuario correctamente',
                      'success'
            );
            this.miFormulario.reset();
          }else{
            Swal.fire('Error',
                      ok,
                      'error'
            );          
          }
        });
  }

}
