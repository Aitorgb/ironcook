const mongoose = require("mongoose");

const recipesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: [true, "Name is required"]
    },
    description: {
      type: String,
      required: [true, "Description is required"]
    },
    ingredients: {
      type: [String],
      required: true
    },
    steps: {
      type: [String],
      required: true
      },
    image: [{
      type: String,
    }],
    duration: {
        type: Number,
        required: true
    }
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true }}
);

recipesSchema.virtual('comment', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'recipes'
});

const Recipes = mongoose.model("Recipes", recipesSchema);

module.exports = Recipes;