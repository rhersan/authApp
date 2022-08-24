import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IAuthResponse, IUsuario } from '../interfaces/interfaces';
import { catchError, map, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _baseUrl: string = environment.base_url;
  private _usuario!: IUsuario;

  get usuario(){
    return {...this._usuario};
  }

  constructor(private http: HttpClient) { }


  registro(name: string, email: string, password: string){
    const url = `${this._baseUrl}/auth/new`;
    const body = { name, email, password }

    return this.http.post<IAuthResponse>(url, body)
          .pipe(
            tap( ({ok, token}) => {
                
              if( ok ){
                localStorage.setItem('token', token!);
              }
              
            }),
            map(resp =>  resp.ok),
            catchError( err => of(err.error.msg))
          );
  }


  login(email: string, password: string){

    const url = `${this._baseUrl}/auth`;
    const body = {
      email, password
    }

    return this.http.post<IAuthResponse>(url, body)
            .pipe(
              tap( resp => {
                
                if( resp.ok ){
                  localStorage.setItem('token', resp.token!);
                }
                
              }),
              map( resp => resp.ok),
              catchError( err => of(err.error.msg) )
            );

  }

  validarToken(): Observable<boolean>{
    const url =  `${this._baseUrl}/auth/renew`;
    const headers =  new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '')

    return this.http.get<IAuthResponse>( url,{ headers } )
            .pipe(
              map( resp => {
                this.guardarInfo(resp);
                return resp.ok; 
              }),
              catchError( err => of(false))
            )

  }

  async guardarInfo(resp: IAuthResponse){    
    localStorage.setItem('token', resp.token!);
    this._usuario  = {
      name: resp.name!,
      uid: resp.uid!,
      email: resp.email!

    }
    await this._usuario;
  }


  logout(){
    localStorage.removeItem('token');
  }

}
