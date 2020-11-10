import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AskNumberComponent } from './auth/ask_number/ask_number.component';

const routes:Routes=[
  {path:"",component:PostListComponent},
  {path:"create",component:PostCreateComponent , canActivate:[AuthGuard]},
  {path:"edit/:postId",component:PostCreateComponent , canActivate:[AuthGuard]},
  {path:"login",component:LoginComponent },
  {path:"signup",component:SignupComponent},
  {path:"test",component:AskNumberComponent},
];
@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule],
  providers:[AuthGuard]
})

export class AppRoutigModule{}
