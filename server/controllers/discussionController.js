const DiscussionPost = require("../models/DiscussionPost");

const getPosts = async (req, res) => {
  try {
    const { subject } = req.query;

    const filter = {};

    if (subject && subject.trim()) {
      filter.subject = subject.trim();
    }

    const posts = await DiscussionPost.find(filter)
      .populate(
        "createdBy",
        "name email role"
      )
      .populate(
        "comments.user",
        "name role"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error(
      "Get discussion posts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch discussion posts",
      error: error.message,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      subject,
    } = req.body;

    if (
      !title ||
      !content ||
      !subject
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, content and subject are required",
      });
    }

    const post = await DiscussionPost.create({
      title: title.trim(),
      content: content.trim(),
      subject: subject.trim(),
      createdBy: req.user._id,
    });

    const populatedPost =
      await DiscussionPost.findById(
        post._id
      ).populate(
        "createdBy",
        "name email role"
      );

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error(
      "Create discussion post error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create discussion post",
      error: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (
      !text ||
      !text.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const post =
      await DiscussionPost.findById(
        req.params.id
      );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      user: req.user._id,
      text: text.trim(),
    });

    await post.save();

    const updatedPost =
      await DiscussionPost.findById(
        post._id
      )
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "comments.user",
          "name role"
        );

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(
      "Add discussion comment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to add comment",
      error: error.message,
    });
  }
};

const toggleLike = async (req, res) => {
  try {
    const post =
      await DiscussionPost.findById(
        req.params.id
      );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId =
      req.user._id.toString();

    const existingIndex =
      post.likes.findIndex(
        (id) =>
          id.toString() === userId
      );

    if (existingIndex >= 0) {
      post.likes.splice(
        existingIndex,
        1
      );
    } else {
      post.likes.push(
        req.user._id
      );
    }

    await post.save();

    return res.status(200).json({
      success: true,
      liked: existingIndex === -1,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error(
      "Toggle discussion like error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update like",
      error: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const post =
      await DiscussionPost.findById(
        req.params.id
      );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const isOwner =
      post.createdBy.toString() ===
      req.user._id.toString();

    const isAdmin =
      req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to delete this post",
      });
    }

    await post.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete discussion post error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete discussion post",
      error: error.message,
    });
  }
};

module.exports = {
  getPosts,
  createPost,
  addComment,
  toggleLike,
  deletePost,
};