const router = require("express").Router();
const { User, Post } = require("../../models");
var posts;

Post.findAll({
  include: [User]
})
  .then((dbPostData) => {
    posts = dbPostData.map((post) => post.get({ plain: true }));
  })
  .catch((err) => {
    res.status(500).json(err);
  });

router.post("/", (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password
  })
  .then(dbUserData => {
    req.session.save(() => {
      req.session.userId = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      res.render("all-post", { posts, loggedIn: req.session.loggedIn });
      // res.json(dbUserData);
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post("/login", (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    req.session.save(() => {
      req.session.userId = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      res.render("all-post", { posts, loggedIn: req.session.loggedIn });
    });
    
  });
});

router.get('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
    res.render("all-post", {posts});
  }
  else {
    res.status(404).end();
  }
});

module.exports = router;