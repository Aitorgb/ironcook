const mongoose = require('mongoose')
const User = require('../models/user.model')
const Recipes = require('../models/recipes.model')
const Comment = require('../models/comments.model')

module.exports.create = (req, res, next) => { 
    const comment = new Comment({
      ...req.body,
      user: req.currentUser._id
    })
    console.log(req.currentUser._id);
  
    const redirect = () => {
      res.redirect(`/recipes/${req.body.recipes}`)
    }
  
    comment.save()
      .then(redirect)
      .catch(redirect)
  }
  
  module.exports.delete = (req, res, next) => {
      console.log('heeheheheheh');
    Comment.findById(req.params.id)
      .then(comment => {
        if (comment.user.toString() === req.currentUser._id.toString()) {
          Comment.findByIdAndDelete(comment._id)
            .then(() => {
                res.redirect(`/recipes/${req.body.recipes}`)
            })
            .catch(next)
        } else {
            res.redirect(`/recipes/${req.body.recipes}`)
        }
      })
      .catch(next)
  }