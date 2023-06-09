const Comment = require("../models/comment");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.createComment = [
  body("text", "Comment text is required").trim().isLength({ min: 1 }),
  async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors = errors.formatWith((error) => error.msg);
        return res.status(400).json({ error: errors.array() });
      }
      if (!req.params.postId) {
        return res.status(400).json({ error: "Post ID is missing" });
      }
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      const comment = new Comment({
        postId: post.id,
        userId: req.user.id,
        text: req.body.text,
      });
      await comment.save();
      return res.status(200).json({ success: "Comment created successfully" });
    } catch (err) {
      return next(err);
    }
  },
];

exports.getComments = async (req, res, next) => {
  try {
    if (!req.params.postId) {
      return res.status(400).json({ error: "Post ID is missing" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comments = await Comment.find({ postId: post.id })
      .sort({ timestamp: -1 })
      .populate("userId", "firstName lastName profilePicUrl");
    return res.status(200).json({ comments });
  } catch (err) {
    return next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    if (!req.params.commentId) {
      return res.status(400).json({ error: "Comment ID is missing" });
    }
    const comment = Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment" });
    }
    await Comment.findByIdAndRemove(req.params.commentId);
    return res.status(200).json({ success: "Comment deleted successfully" });
  } catch (err) {
    return next(err);
  }
};
