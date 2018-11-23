const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport') 

// loading post model from mongoose models
const Post = require('../../models/Post')
// loading profile model from mongoose models
const Profile = require('../../models/Profile')

// validation
const validatePostInput = require('../../validation/post')

// GET test api/posts
router.get('/test', (req, res)=> res.json({msg: "posts works"}))

// GET request - api/posts - Fetch all posts - public
router.get('/', (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found'}))
})

// GET request - api/posts/:id - Fetch post by id - public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: 'No post found with this id'}))
})

// POST request - api/posts - create new post - private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body)

    // Check validation
     if(!isValid) {
         // if any errors, send 400 with errors object
         return res.status(400).json(errors)
     }
     
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    })

    newPost.save().then(post => res.json(post))
})

// DELETE request - api/posts/:id - Delete the post with id parameter - private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // check for the post owner
                    if(post.user.toString() !== req.user.id) {
                        return res.status(401).json({ notauthorized: 'User not authorized'})
                    }

                    // Delete the post
                    post.remove().then(() => res.json({ success: true}))
                })
                .catch(err => res.status(404).json({ postnotfound: 'Post not found'}))
        })
})

// POST request - api/posts/like/:id - like the post - private
router.post('/like/:id',passport.authenticate('jwt', { session: false }),(req, res) => {
      Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                    return res.status(400).json({ alreadyliked: 'User already liked this post' })
                }
  
                // Add user id to likes array
                post.likes.unshift({ user: req.user.id })
  
                post.save().then(post => res.json(post))
          })
          .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
      })
    }
  )

  // POST request - api/posts/unlike/:id - unlike the post - private
router.post('/unlike/:id',passport.authenticate('jwt', { session: false }),(req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
          Post.findById(req.params.id)
              .then(post => {
              if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                  return res.status(400).json({ notliked: 'You have not yet liked this post' })
              }

            // get remove index
            const removeIndex = post.likes
                .map(item => item.user.toString())
                .indexOf(req.user.id)

            // splice out of array
            post.likes.splice(removeIndex, 1)
            
            // save the changes
            post.save().then(post => res.json(post))
 
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
    })
  }
)

// POST request - api/posts/comment/:id - add a comment for a post - private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body)

    // Check validation
     if(!isValid) {
         // if any errors, send 400 with errors object
         return res.status(400).json(errors)
     }
    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }
            
            // add comment to comments array
            post.comments.unshift(newComment)

            // save the changes
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'Post not found'}))
})

// DELETE request - api/posts/comment/:id/:comment_id - remove a comment from a post - private
router.delete('/comment/:id/:comment_id',passport.authenticate('jwt', { session: false }),(req, res) => {
      Post.findById(req.params.id)
        .then(post => {
          // Check to see if comment exists
          if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
            return res.status(404).json({ commentnotexists: 'Comment does not exist' })
          }
  
          // Get remove index
          const removeIndex = post.comments
            .map(item => item._id.toString())
            .indexOf(req.params.comment_id)
  
          // Splice comment out of array
          post.comments.splice(removeIndex, 1)
          
          // save the changes
          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'Post not found' }))
    }
  )

module.exports = router