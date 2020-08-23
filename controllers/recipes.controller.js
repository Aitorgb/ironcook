const mongoose = require('mongoose')
const User = require('../models/user.model')
const Recipes = require('../models/recipes.model')
const Comment = require('../models/comments.model')
const nodemailer = require('../configs/mailer.config');
const passport = require('passport')

module.exports.recipe = (req, res, next) => {
    Recipes.findById(req.params.id)
    .populate('user')
    .populate({
      path: 'comment',
      options: {
        sort: {
          createdAt: -1
        }
      },
      populate: 'user'
    })
    .then(recipes => {
      if (recipes) {
      const recipe = {
          '_id' : recipes._id,
          'ingredients' : recipes.ingredients,
          'steps' : recipes.steps,
          'image' : recipes.image,
          'user' : recipes.user,
          'name' : recipes.name,
          "description" : recipes.description,
          "duration" : (recipes.duration / 4000).toFixed(2),
          "createdAt" : recipes.createdAt.getDate()+ '/' + (recipes.createdAt.getMonth()+1) + '/'+ recipes.createdAt.getFullYear(),
          "updatedAt" : recipes.updatedAt,
          "comments" : recipes.comment,
          "__v" : recipes._v
        }
        // console.log(recipe.comments);
      res.render('recipes/recipe', {recipe, user : res.locals.currentUser})
      }
    })
      .catch(e => next(e))
  }

  module.exports.createRecipeView = (req, res, next) => {
    res.render('recipes/recipeNew', {user : req.currentUser})
  }

  module.exports.deleteRecipe = (req, res, next) => {
    Recipes.findByIdAndDelete(req.params.id)
    .then(recipes => {
      res.redirect('/profile')
    })
      .catch(e => next(e))
  }
  
  module.exports.createRecipe = (req, res, next) => {
    const recipesParam = req.body;
    recipesParam.image = req.file ? req.file.path : undefined;
    req.body.duration = parseFloat(req.body.duration)
    recipesParam.user = req.currentUser._id
    const recipes = new Recipes(recipesParam);
    console.log(recipes);
    recipes.save()
      .then(recipe => {
            res.redirect('/profile')
      })
      .catch(next)
  }