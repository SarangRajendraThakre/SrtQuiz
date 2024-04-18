const express = require("express");
const router = express.Router();
const { createChat, findUserChats, findChat } = require("../Controllers/chatController");

router.post("/", (req, res) => {
  console.log("Request received to create chat:", req.body);
  createChat(req, res);
});

router.get("/:userId", (req, res) => {
  console.log("Request received to find user chats. User ID:", req.params.userId);
  findUserChats(req, res);
});

router.get("/find/:firstId/:secondId", (req, res) => {
  console.log("Request received to find chat between users:", req.params.firstId, req.params.secondId);
  findChat(req, res);
});

module.exports = router;
