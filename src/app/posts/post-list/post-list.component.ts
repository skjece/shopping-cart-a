import { AuthService } from './../../auth/auth.service';
import { postsService } from './../posts.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector:"app-post-list",
  templateUrl:"./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit,OnDestroy{

  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];

  constructor(public postsService:postsService , public authService:AuthService){}
  posts:Post[]= [];
  postsSub:Subscription;
  isLoading=false;
  totalPosts=11;
  postsPerPage=2;
  pageSizeOptions=[1,2,5,10];
  currentPage=1;
  isUserAuthenticated=false;
  authStatusListenerSubs:Subscription;
  userId:string;
  //isAuthorized:boolean=false;

  ngOnInit()
  {
    this.isLoading=true;

    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.postsSub=this.postsService.getPostArrayUpdateListener()
    .subscribe((postData :  {posts: Post[], postCount: number} )=>{
      this.isLoading=false;
      this.totalPosts=postData.postCount;
      this.posts=postData.posts;
    });

    this.userId=this.authService.getUserId();
    this.isUserAuthenticated=this.authService.getCurrentAuthStatus();
    this.authStatusListenerSubs= this.authService.getAuthStatusListener()
    .subscribe((isAuthenticated)=>{
      this.isUserAuthenticated=isAuthenticated;
      this.userId=this.authService.getUserId();
    })
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusListenerSubs.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId).subscribe(()=> {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData:PageEvent){
    console.log(pageData);
    this.isLoading=true;
    this.postsPerPage=pageData.pageSize;
    this.currentPage=pageData.pageIndex+1;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
  }

}
