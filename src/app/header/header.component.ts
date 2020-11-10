import { Subscription } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector:"app-header",
  templateUrl:"./header.component.html",
  styleUrls:["./header.component.css"]

})
export class HeaderComponent implements OnInit,OnDestroy{
  constructor(public authService:AuthService){};
  isUserAuthenticated=false;
  authStatusListenerSubs:Subscription;

  ngOnInit(){
    this.isUserAuthenticated=this.authService.getCurrentAuthStatus();
    this.authStatusListenerSubs=this.authService.getAuthStatusListener()
    .subscribe((isAuthenticated)=>{
      this.isUserAuthenticated=isAuthenticated;
    });

  }

  ngOnDestroy(){
    this.authStatusListenerSubs.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
  }
}
