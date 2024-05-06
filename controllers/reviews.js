const Movie = require("../models/movie");

module.exports = {
  create,
  delete: deleteReview,
  edit,
  update,
};

async function create(req, res) {
  const movie = await Movie.findById(req.params.id);

  // Add the user-centric info to req.body (the new review)
  req.body.user = req.user._id;
  req.body.userName = req.user.name;
  req.body.userAvatar = req.user.avatar;

  // We can push (or unshift) subdocs into Mongoose arrays
  movie.reviews.push(req.body);
  try {
    // Save any changes made to the movie doc
    await movie.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/movies/${movie._id}`);
}

async function deleteReview(req, res) {
  // Note the cool "dot" syntax to query on the property of a subdoc
  const movie = await Movie.findOne({
    "reviews._id": req.params.id,
    "reviews.user": req.user._id,
  });
  // Rogue user!
  if (!movie) return res.redirect("/movies");
  // Remove the review using the remove method available on Mongoose arrays
  movie.reviews.remove(req.params.id);
  // Save the updated movie doc
  await movie.save();
  // Redirect back to the movie's show view
  res.redirect(`/movies/${movie._id}`);
}

async function edit(req, res) {
  // Note the cool "dot" syntax to query on the property of a subdoc
  const movie = await Movie.findOne({ "reviews._id": req.params.id });
  // Find the comment subdoc using the id method on Mongoose arrays
  // https://mongoosejs.com/docs/subdocs.html
  const review = movie.reviews.id(req.params.id);
  // Render the comments/edit.ejs template, passing to it the comment
  res.redirect(`/movies/${movie._id}`);
}

async function update(req, res) {
  // Note the cool "dot" syntax to query on the property of a subdoc
  const movie = await Movie.findOne({ "reviewa._id": req.params.id });
  // Find the comment subdoc using the id method on Mongoose arrays
  // https://mongoosejs.com/docs/subdocs.html
  const commentSubdoc = movie.reviews.id(req.params.id);
  // Ensure that the comment was created by the logged in user
  if (!commentSubdoc.userId.equals(req.user._id))
    return res.redirect(`/movies/${movie._id}`);
  // Update the text of the comment
  commentSubdoc.text = req.body.text;
  try {
    await movie.save();
  } catch (e) {
    console.log(e.message);
  }
  // Redirect back to the book's show view
  res.redirect(`/movies/${movie._id}`);
}
