const express = require("express");
const router = express.Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");


router.route("/:_id").post(accessChat);
router.route("/:_id").get(fetchChats);
router.route("/group/:_id").post( createGroupChat);
router.route("/rename").put( renameGroup);
router.route("/groupremove").put( removeFromGroup);
router.route("/groupadd").put( addToGroup);

module.exports = router;