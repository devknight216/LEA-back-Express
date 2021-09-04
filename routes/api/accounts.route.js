const express = require('express');
const passport = require("passport");

const usersmanageMiddleware = require("../../middleware/usersmanage.middleware");
const accountsController = require('../../controllers/accounts.controller');

const router = express.Router();

router.post("/", passport.authenticate('jwt', {session: false}), usersmanageMiddleware("CREATE"), accountsController.create);

router.get("/", passport.authenticate('jwt', {session: false}), usersmanageMiddleware("INDEX"), accountsController.findAll);

router.get("/:id", passport.authenticate('jwt', {session: false}), usersmanageMiddleware("READ"), accountsController.findOne);

router.put("/:id", passport.authenticate('jwt', {session: false}), usersmanageMiddleware("UPDATE"), accountsController.update);

router.delete("/:id", passport.authenticate('jwt', {session: false}), usersmanageMiddleware("DELETE"), accountsController.deleteOne);

router.post("/avatar", passport.authenticate('jwt', {session: false}), usersmanageMiddleware("CREATE"), accountsController.uploadAvatar);

router.route("/avatar/:userId")
.get(passport.authenticate('jwt', {session: false}), usersmanageMiddleware("READ"), accountsController.getUserAvatar)
.delete(passport.authenticate('jwt', {session: false}), usersmanageMiddleware("DELETE"), accountsController.removeUserAvatar);

module.exports = router;
