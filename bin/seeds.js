require("../configs/db.config");

const User = require("../models/user.model");
const Recipes = require("../models/recipes.model");
const Comment = require("../models/comments.model");
const faker = require("faker");
const mongoose = require('mongoose');

const userIds = [];

Promise.all([
  User.deleteMany({}),
  Recipes.deleteMany({}),
  Comment.deleteMany({})
])
  .then(() => {
    console.log('empty database')

    for (let i = 0; i < 50; i++) {
      const user = new User({
        name: faker.name.findName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        avatar: faker.image.avatar(),
        bio: faker.lorem.sentence(),
        createdAt: faker.date.past(),
      });

      user.save()
        .then(user => {
          userIds.push(user._id);

          for(let j = 0; j < 50; j++) {
            const recipes = new Recipes({
              user: user._id,
              name: faker.lorem.words(),
              description: faker.lorem.paragraph(),
              image: faker.image.food(),
              duration: faker.random.number(),
              createdAt: faker.date.past(),
            });
            for (let i = 0; i < numberRandom(); i++) {
              recipes.ingredients.push(faker.lorem.sentence())
              recipes.steps.push(faker.lorem.sentence())
            }

            recipes.save()
              .then(recipe => {
                for (let k = 0; k < 10; k++) {
                  const comment = new Comment({
                    user: userIds[Math.floor(Math.random() * userIds.length)],
                    recipes: recipe._id,
                    text: faker.lorem.paragraph(),
                    createdAt: faker.date.past(),
                  });

                  comment.save();
                }
              })
              .catch(e => console.log(e))
          }
        })
    }
  })

  ///mongoose.connection.close()


  function numberRandom() {
    return Math.floor(Math.random() * (8 - 4) + 4)
  }