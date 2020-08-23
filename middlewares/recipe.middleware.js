const Recipe = require('../models/recipes.model')
const Comment = require('../models/comments.model')

module.exports.recipeOwner = (req, res, next) => {
  Recipe.findById(req.params.id)
    .then(recipe => {
      if (recipe.user.toString() === req.currentUser.id.toString()) {
        req.recipe = recipe
        next()
      } else {
        res.redirect(`/recipes/${req.params.id}`)
      }
    })
    .catch(next)
}

module.exports.recipeOwnerComment = (req, res, next) => {
    Comment.findById(req.params.id)
    .then(recipe => {
      if (recipe.user.toString() === req.currentUser.id.toString()) {
        req.recipe = recipe
        next()
      } else {
        res.redirect(`/recipes/${req.body.recipes}`)
      }
    })
    .catch(next)
  }