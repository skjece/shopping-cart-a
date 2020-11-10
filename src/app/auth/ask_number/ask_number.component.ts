import { AuthService } from '../auth.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector:"app_ask_number",
  templateUrl:"./ask_number.component.html",
  styleUrls:["./ask_number.component.css"]
})

export class AskNumberComponent{

  //isLoading=false;

  // constructor(public authService:AuthService){};
  onLogin(msisdn:string){
    // if (form.invalid) {
    //   return;
    // }
   console.log(msisdn);

  }
}
