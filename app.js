import express from "express";
import path from "node:path";
import { router as userRouter } from "./routes/user.js";
import { router as blogRouter } from "./routes/blog.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { checkForAuthCookie } from "./middlewares/authentication.js";
import { Blog } from "./models/blog.js";
import { config } from "dotenv";
config();
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("db connected");
});
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(checkForAuthCookie());
app.use(express.urlencoded({ extended: false }));

app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
  console.log(req.user);
  res.render("home", { user: req.user, blogs: allBlogs });
});
app.listen(PORT, () => {
  console.log("Server running at port: 3000");
});
