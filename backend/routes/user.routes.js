const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const eventController = require("../controllers/event.controller");
const multer = require('multer');
const upload = multer();

//auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logOut);

//user display
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:userId", userController.updateUser);
router.put("/:userId/updatePic", userController.updatePic);
router.delete("/:id", userController.deleteUser);


//reset password email
router.post('/trustedemail', authController.demanderResetMotDePasse);
router.post('/resetpassword', authController.resetMotDePasse);

//reset password email
router.post('/secretquestion', authController.getSecretQuestion);
router.post('/resetpassword2', authController.resetPasswordWithSecretAnswer);

//reset password phone
router.post('/stepone', authController.stepone);
router.post('/steptwo', authController.steptwo);


router.post("/events/:id", eventController.createEvent);
router.get("/getEvents/:id", eventController.getAllEventsByUserId);
router.delete("/events/:id/:eventId", eventController.deleteEvent);


router.post("/upload", upload.single("file"), uploadController.uploadProfil);



module.exports = router;