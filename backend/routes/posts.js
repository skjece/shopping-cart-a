const express =require('express');
const router =express.Router(); //using router provided by express
const Post = require("../models/post");
const checkToken =require("./../middleware/check-token");

router.post("", checkToken,(req, res, next) => {
  console.log("post-rq::"+JSON.stringify(req.body));

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    creator: req.userData.userId
  });

  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      postId: createdPost._id
    })
  });

});


router.get("", (req, res, next) => {
  console.log("get-rq::"+JSON.stringify(req.query));
  const pageSize=+req.query.pageSize;
  const currentPage=+req.query.currentPage;
  let fetchedPosts;
  const postQuery = Post.find();
  if(pageSize && currentPage)
  {
    postQuery
    .skip(pageSize*(currentPage-1))
    .limit(pageSize);
  }

  postQuery
  .then((documnets)=>{
    fetchedPosts=documnets;
    return Post.count();

  })
  .then((count) => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts: count
    })
  })
});

router.delete("/:postId", checkToken, (req, res, next) => {
  console.log("delete-req");
  Post.deleteOne({_id:req.params.postId, creator:req.userData.userId})
  .then((result)=>{
    //console.log(result);
    // res.status(200).json({message:"post deleted successfully"});

    if (result.n > 0) {
      res.status(200).json({ message: "Deletion successful!" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  })
});

router.put("/:id",checkToken,(req,res,next)=>{
  const post={
    _id:req.body.id,
    title:req.body.title,
    content:req.body.content,
    creator:req.userData.userId
  }
 // console.log("update-post:"+JSON.stringify(post))
  Post.updateOne({_id : req.params.id, creator:req.userData.userId},post)
  .then(result => {

    if (result.nModified > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  })
});

router.get("/:id", (req, res, next) => {
  //console.log("get-rq::"+JSON.stringify(req.body));
  Post.findById(req.params.id).then((post)=>{
    if(post)
    res.status(200).json(post);
    else
    res.status(401).json({message:"post not found"})
  })
})


module.exports = router;
