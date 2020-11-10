import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({providedIn:"root"})

export class AuthGuard implements CanActivate{

  constructor(public authService:AuthService , public router:Router){};


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const isUserAuthenticated=this.authService.getCurrentAuthStatus();
    if(!isUserAuthenticated)
    {
      this.router.navigate(["/login"]);
    }
    return isUserAuthenticated;

  }

}
