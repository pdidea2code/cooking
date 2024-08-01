const express = require("express");
const verifyAppToken = require("../../helper/verifyAppToken");
const { addComment } = require("../../controllers/app/commentController");
const { singleFileUpload } = require("../../helper/imageUpload");
const router = express.Router();

router.post(
  "/addcomment",
  verifyAppToken,
  singleFileUpload("public/images/commentimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  addComment
);

module.exports = router;
