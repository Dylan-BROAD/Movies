const express = require("express");
const router = express.Router();
// You'll be creating this controller module next
const moviesCtrl = require("../controllers/movies");
const ensureLoggedIn = require("../config/ensureLoggedIn");

router.get("/", moviesCtrl.index);
// Use ensureLoggedIn middleware to protect routes
router.get("/new", ensureLoggedIn, moviesCtrl.new);
router.get("/:id", moviesCtrl.show);
router.post("/", ensureLoggedIn, moviesCtrl.create);

module.exports = router;
