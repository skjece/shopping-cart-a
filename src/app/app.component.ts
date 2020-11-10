import { AuthService } from './auth/auth.service';
import { Component, Injectable, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent implements OnInit{
  constructor(public authService:AuthService){}
  title = 'mean-stack-a';

  ngOnInit(){
    this.authService.autoAuthUser();
  }


}
