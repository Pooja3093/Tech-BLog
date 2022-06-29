const router = require("express").Router();
const { Post, Comment, User } = require("../models");
const withAuth = require("../utils/auth");

// get all posts for homepage
router.get("/", (req, res) => {
  Post.findAll({
    include: [User]
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));

      res.render("all-post", { posts,
        loggedIn: req.session.loggedIn  });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// get single post
router.get("/post/:id", withAuth, (req, res) => {
  Post.findByPk(req.params.id, {
    include: [
      User,
      {
        model: Comment,
        include: [User]
      },
    ],
  })
    .then((dbPostData) => {
      if (dbPostData) {
        const post = dbPostData.get({ plain: true });

        res.render("single-post", { post,
          loggedIn: req.session.loggedIn });
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});


// Create new post
router.get("/new", withAuth, (req, res) => {
  res.render("new-post");
});

router.get("/edit/:id", withAuth, (req, res) => {
  Post.findByPk(req.params.id)
    .then(dbPostData => {
      if (dbPostData) {
        const post = dbPostData.get({ plain: true });
        
        res.render("edit-post", {
          layout: "dashboard",
          post
        });
      } else {
        res.status(404).end();
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("signup");
});


router.get("/logout", (req, res) => {
    res.redirect("/api/user/logout");
});

module.exports = router;