import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {catchError, retry} from 'rxjs/internal/operators';
import { Observable,of } from 'rxjs';

interface Register {
  email: string;
  password: string;
}
const url :string = `https://reqres.in/api`;

@Injectable({
  providedIn: 'root'
})

export class ApiCallsService {
  constructor(private http: HttpClient) { }

  register(registrationValue:Register) {
    return this.http.post<Register>(`${url}/register`,registrationValue).pipe(
      catchError(this.handleError('Registration', registrationValue))
    );
  }

  login(loginValues:Register) {
    return this.http.post<Register>(`${url}/login`,loginValues).pipe(
      catchError(this.handleError('Logon', loginValues))
    );
  }

  getUserList(pagination:number){
    return this.http.get(`${url}/users?page=${pagination}`).pipe(
      catchError(this.handleError('User List', 'user list'))
    );
  }

  delete(userId:number){
    return this.http.delete(`${url}/users/${userId}`).pipe(
      catchError(this.handleError('User deleted', 'user deleted'))
    );
  }

  singleUserDeatils(userId:number){
    return this.http.get(`${url}/users/${userId}`).pipe(
      catchError(this.handleError('Single search', 'user not found'))
    );
  }

  update(userId:number,userInfo:number){
    return this.http.put(`${url}/users/${userId}`,userInfo).pipe(
      catchError(this.handleError('Single search', 'user not found'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  
  private log(message: string) {
    console.log(message);
  }

  storeLoggedInToken(token:string){
    sessionStorage.setItem('Token',token);
  }
  getLoggedInToken(){
    return sessionStorage.getItem('Token');
  }
}
