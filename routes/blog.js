import express from "express";
import multer from "multer";
import path from "node:path";
import { Comment } from "../models/comment.js";
import { Blog } from "../models/blog.js";
export const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, path.resolve("./public/uploads/"));
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + file.originalname);
  },
});

export const multerUpload = multer({ storage: storage });
router.get("/add-new", (req, res) => {
  return res.render("addBlog", { user: req.user });
});

router.post("/", multerUpload.single("coverImage"), async (req, res) => {
  console.log(req.body);
  const { title, body } = req.body;
  console.log(req.file);
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageUrl: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogId", async (req, res) => {
  const blogId = req.params.blogId;
  const blog = await Comment.create({
    content: req.body.content,
    blogId: blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${blogId}`);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id });
  console.log(blog);
  res.render("blog", { user: req.user, blog: blog, comments: comments });
});
