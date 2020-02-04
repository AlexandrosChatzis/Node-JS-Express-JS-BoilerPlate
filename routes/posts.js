const express = require("express");
const Post = require("../models/Post");
const router = express.Router();
router.get("/val", (req, res) => {
  try {
    console.log(req.query.val);
    res.send(req.query.val);
  } catch (err) {
    res.json({ message: err });
  }
});
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});
router.post("/", (req, res) => {
  //console.log(req.body);
  const post = new Post({
    title: req.body.title,
    description: req.body.description
  });

  post
    .save()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json({ message: err });
    });
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (err) {
    res.json({ message: err });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const removePost = await Post.deleteOne({ _id: req.params.id });
    res.json({ message: "removed" });
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatePost = await Post.updateOne(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          description: req.body.description
        }
      }
    );

    res.json({ message: "updated" });
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
