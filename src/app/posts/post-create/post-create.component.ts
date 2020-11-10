import { postsService } from './../posts.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector:"app-post-create",
  templateUrl:"./post-create.component.html"
})

export class PostCreateComponent implements OnInit{
  post: Post;
  private mode = "create";
  isLoading=false;

  private postId: string;
  constructor(public postsService:postsService,public route:ActivatedRoute){}

  ngOnInit(){
    this.route.paramMap.subscribe((paramMap)=>{
      if(paramMap.has('postId')){
        this.mode='edit';
        this.postId = paramMap.get("postId");

        this.isLoading=true;
        this.postsService.getPost(this.postId)
        .subscribe((postData) => {
          this.isLoading=false;
          this.post={id:postData._id,title:postData.title,content:postData.content,creator:postData.creator}
        });

        console.log("onEdit->"+JSON.stringify(this.post))
      }else{
        this.mode = "create";
        this.postId = null;
      }
    })
  }

  onAddPost(form:NgForm)
  {
    if (form.invalid) {
      return;
    }
    this.isLoading=true;
    if(this.mode=='create')
      this.postsService.addPost(form.value.title, form.value.content);
    else
      this.postsService.updatePost(this.postId,form.value.title, form.value.content);
    form.resetForm();

  }
}
