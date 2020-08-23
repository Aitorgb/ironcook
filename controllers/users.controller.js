const mongoose = require('mongoose')
const User = require('../models/user.model')
const Recipes = require('../models/recipes.model')
const nodemailer = require('../configs/mailer.config');
const passport = require('passport')

module.exports.login = (req, res, next) => {
  res.render('users/login')
}

module.exports.doSocialLoginGoogle = (req, res, next) => {
  const passportController = passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  }, (error, user) => {
    if (error) {
      next(error);
    } else {
      req.session.userId = user._id;
      res.redirect("/home");
    }
  })
  
  passportController(req, res, next);
}

module.exports.doLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        user.checkPassword(req.body.password)
          .then(match => {
            if (match) {
              if (user.activation.active) {
                req.session.userId = user._id
                res.redirect('/home')
              } else {
                res.render('index', {
                  error: {
                    validation: {
                      message: 'Your account is not active, check your email!'
                    }
                  }
                })
              }
            } else {
              res.render('index', {
                error: {
                  email: {
                    message: 'user not found'
                  }
                }
              })
            }
          })
      } else {
        res.render("index", {
          error: {
            email: {
              message: "user not found",
            },
          },
        });
      }
    })
    .catch(next)
}

module.exports.home = (req, res, next) => {
  Recipes.find()
      .sort({ createdAt: -1 })
      .limit(40)
      .then(recipes => {
        recipes = recipes.map(recipes => {
          return {
            '_id' : recipes._id,
            'ingredients' : [
              recipes.ingredients
            ],
            'steps' : [
              recipes.steps
            ],
            'image' : [
              recipes.image
            ],
            'user' : recipes.user,
            'name' : recipes.name,
            "description" : recipes.description,
            "duration" : (recipes.duration / 4000).toFixed(2),
            "createdAt" : recipes.createdAt.getDate()+ '/' + (recipes.createdAt.getMonth()+1) + '/'+ recipes.createdAt.getFullYear(),
            "updatedAt" : recipes.updatedAt,
            "__v" : recipes._v
          }
        })
        
        res.render('home', {recipes, user : req.currentUser})
      })
  
}

module.exports.signup = (req, res, next) => {
  res.render('users/signup')
}



module.exports.createUser = (req, res, next) => {
  const userParams = req.body;
  userParams.avatar = req.file ? req.file.path : undefined;
  const user = new User(userParams);
  user.save()
    .then(user => {
      nodemailer.sendValidationEmail(user.email, user.activation.token, user.name);
      res.render('index', {
        message: 'Check your email for activation'
      })
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("users/signup", { error: error.errors, user });
      } else if (error.code === 11000) { // error when duplicated user
        res.render("users/signup", {
          user,
          error: {
            email: {
              message: 'user already exists'
            }
          }
        });
      } else {
        next(error);
      }
    })
    .catch(next)
}

module.exports.activateUser = (req, res, next) => {
  User.findOne({ "activation.token": req.params.token })
    .then(user => {
      if (user) {
        user.activation.active = true;
        user.save()
          .then(user => {
            res.render('index', {
                message: 'Your account has been activated, log in below!'
              })
          })
        .catch(e => next)
      } else {
        res.render('index', {
          error: {
            validation: {
              message: 'Invalid link'
            }
          }
        })
      }
    })
    .catch(e => next)
}

module.exports.profile = (req, res, next) => {
  User.findById(req.currentUser._id)
    .populate('recipes')
    .then(profile => {
      if (profile) {
        req.profile = profile
        recipes = profile.recipes.map(recipes => {
          return {
            '_id' : recipes._id,
            'ingredients' : [
              recipes.ingredients
            ],
            'steps' : [
              recipes.steps
            ],
            'image' : [
              recipes.image
            ],
            'user' : recipes.user,
            'name' : recipes.name,
            "description" : recipes.description,
            "duration" : (recipes.duration / 4000).toFixed(2),
            "createdAt" : recipes.createdAt.getDate()+ '/' + (recipes.createdAt.getMonth()+1) + '/'+ recipes.createdAt.getFullYear(),
            "updatedAt" : recipes.updatedAt,
            "__v" : recipes._v
          }
        })
        res.render('users/profile', {profile, recipes , user : req.currentUser})
      }
      return
    })
    .catch(next)
  
}

module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.redirect('/')
}