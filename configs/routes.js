const express = require('express');
const router = express.Router();
const multer = require('multer');
const usersController = require('../controllers/users.controller')
const recipesController = require('../controllers/recipes.controller')
const commentsController = require('../controllers/comments.controller')
const sessionMiddleware = require('../middlewares/session.middleware')
const recipeMiddleware = require('../middlewares/recipe.middleware')
const uploads = require('../configs/cloudinary.config');

router.get('/auth/google/callback', sessionMiddleware.isNotAuthenticated, usersController.doSocialLoginGoogle);
router.post('/login', sessionMiddleware.isNotAuthenticated, usersController.doLogin);
router.get('/signup', sessionMiddleware.isNotAuthenticated, usersController.signup);
router.get("/", (req, res) => res.render("index"));
router.post('/', sessionMiddleware.isNotAuthenticated, uploads.single('avatar'), usersController.createUser);
router.get('/activate/:token', sessionMiddleware.isNotAuthenticated, usersController.activateUser);
router.get('/home', sessionMiddleware.isAuthenticated, usersController.home)
router.post('/logout', sessionMiddleware.isAuthenticated, usersController.logout);
router.get('/profile', sessionMiddleware.isAuthenticated, usersController.profile);


router.get('/recipes/:id', sessionMiddleware.isAuthenticated,recipesController.recipe);
router.get('/recipes/delete/:id', sessionMiddleware.isAuthenticated,recipeMiddleware.recipeOwner, recipesController.deleteRecipe);
router.get('/createdRecipe', sessionMiddleware.isAuthenticated, recipesController.createRecipeView);
router.post('/createdRecipe', sessionMiddleware.isAuthenticated, uploads.single('imageRecipe'), recipesController.createRecipe);

router.post('/comments', sessionMiddleware.isAuthenticated, commentsController.create)
router.post('/comments/delete/:id', sessionMiddleware.isAuthenticated, recipeMiddleware.recipeOwnerComment, commentsController.delete)



module.exports = router;
