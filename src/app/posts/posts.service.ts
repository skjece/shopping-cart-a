import { AuthService } from './../auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model';
import {map} from 'rxjs/operators'

@Injectable({providedIn:"root"})

export class postsService{


  constructor(public http:HttpClient , public router:Router,public authService:AuthService){}

  private posts: Post[] = [];


  private postsArrayUpdated = new Subject<{posts:Post[],postCount:number}>();

  addPost(title:string,content:string)
  {
    //console.log("post added:"+title+":"+content);
    const post: Post = { id: null, title: title, content: content ,creator:null };
    this.http.post<{ message: string, postId: string }>("https://mean-max-a.herokuapp.com/api/posts",post)
    .subscribe( (responseData) =>{
      console.log("post Added successfully->"+responseData);
      // const id = responseData.postId;
      // post.id=id;
      // this.posts.push(post);
      // this.postsArrayUpdated.next([...this.posts]);
      this.router.navigate([""]);
    });
  }


  getPosts(pageSize,currentPage) {
      //return [...this.posts];
      const queryParam=`?pageSize=${pageSize}&currentPage=${currentPage}`;
      this.http.get<{message:string,posts:any,maxPosts: number}>(
        'https://mean-max-a.herokuapp.com/api/posts'+queryParam)
        .pipe(map((postData)=>{
          return {
            posts:postData.posts.map((post)=>{
              return {
                id:post._id,
                content:post.content,
                title:post.title,
                creator:post.creator
              }
            }),
            maxPosts:postData.maxPosts
          }

        }))
        .subscribe((transformedPostData)=>{
          console.log("getPost:"+JSON.stringify(transformedPostData));
          this.posts= transformedPostData.posts;
          this.postsArrayUpdated.next({
            posts:[...this.posts],
            postCount:transformedPostData.maxPosts
          });
        })
  }

  getPostArrayUpdateListener() {
    return this.postsArrayUpdated.asObservable();
  }


  deletePost(postId:string){
    return this.http.delete( 'https://mean-max-a.herokuapp.com/api/posts/'+postId);
    // .subscribe(()=>{
    //   const updatedPosts=this.posts.filter((post)=>{return post.id!=postId});
    //   this.posts=updatedPosts;
    //   this.postsArrayUpdated.next({
    //     posts :[...this.posts],
    //     postCount:6
    //   });
    //})
  }


  getPost(id:string){
    //return {...this.posts.find(p=>p.id === id)}
    return this.http.get<{_id:string,title:string,content:string,creator:string}>("https://mean-max-a.herokuapp.com/api/posts/"+id);//returns an observable
  }

  updatePost(id:string ,title:string ,content:string){
    const post:Post ={id:id ,title:title,content:content,creator:null};
    this.http.put( 'https://mean-max-a.herokuapp.com/api/posts/'+id , post)
    .subscribe((response)=>{
      //console.log(response);
      // const updatedPosts =[...this.posts];
      // const oldPostIndex=updatedPosts.findIndex(p=>p.id===post.id);
      // updatedPosts[oldPostIndex]=post;
      // this.posts=[...updatedPosts];
      // this.postsArrayUpdated.next([...this.posts]);
      this.router.navigate([""]);
    });

  }

}
