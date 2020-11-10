import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({providedIn:"root"})

export class AuthService{

  private token:string;
  private userId:string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated=false;
  tokenTimer:any;


  constructor(public http:HttpClient,public router:Router){};

  createUser(email:string,password:string){
    const authData:AuthData={email:email,password:password};
    this.http.post("https://mean-max-a.herokuapp.com/api/users/signup",authData)

    .subscribe((response)=>{
      console.log("auth-service-craeteUser"+JSON.stringify(response));
      this.router.navigate(["/"]);
    });
  }

  login(email:string,password:string){
    const authData:AuthData={email:email,password:password};
    this.http.post<{token:string , expiresIn:number , userId:string}>("https://mean-max-a.herokuapp.com/api/users/login",authData)
    .subscribe((response)=>{
      console.log("auth-service-login"+JSON.stringify(response));
      this.token=response.token;

      if(this.token){
        const expiresInDuration = response.expiresIn;
        this.userId = response.userId;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated=true;
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        console.log(expirationDate);
        this.saveAuthData(this.token, expirationDate,this.userId);
        this.authStatusListener.next(true);
        this.router.navigate(["/"]);
      }

    });
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getCurrentAuthStatus(){
    return this.isAuthenticated;
  }

  getToken(){
    return this.token;
  }

  getUserId(){
    return this.userId;
  }

  logout(){
    this.token=null;
    this.isAuthenticated=false;
    this.authStatusListener.next(false);
    this.router.navigate(["/"]);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId=null;
  }

  autoAuthUser(){
    const authInformation=this.getAuthData();

    if(!authInformation)
    return;

    const expiresIn= authInformation.expirationDate.getTime() - new Date().getTime() ;
    if(expiresIn<=0)
    return;

    this.token = authInformation.token;
    this.isAuthenticated=true;
    this.userId=authInformation.userId;
    this.authStatusListener.next(true);
    this.setAuthTimer(expiresIn/1000);


  }

  private saveAuthData(token: string, expirationDate: Date,userId:string) {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId:userId
    }
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }


}
