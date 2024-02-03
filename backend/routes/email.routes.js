// Import du module de routage d'Express
const router = require('express').Router();

// Import du contrôleur EmailController depuis le fichier email.controller.js
const EmailController = require('../controllers/email.controller');
const middleware = require('../middleware/auth.middleware');
const multer = require('multer'); //middleware pour gérer les téléchargements de fichiers dans les requêtes HTTP.

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Spécifiez le répertoire de destination où les fichiers seront enregistrés
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Spécifiez le nom du fichier une fois enregistré
    cb(null, file.originalname);
  },
});

// Initialisation de l'objet d'upload avec la configuration de stockage
const upload = multer({ storage: storage });

// Définition des routes

// Route pour créer un nouvel e-mail en utilisant la méthode HTTP POST
router.post('/sendmail/:idUser',  middleware.checkUser , upload.array('files', 20),EmailController.sendEmail);//ajout de la route pour l'envoi d'un mail

router.get('/sent/:id',  middleware.checkUser ,EmailController.getSentEmails); // Ajout de la route pour les e-mails envoyés
router.get('/inbox/:id',  middleware.checkUser ,EmailController.getReceivedEmails); // Ajout de la route pour les e-mails reçus
router.get('/starred/:id', middleware.checkUser, EmailController.getStarredEmails);
router.get('/bin/:id',  middleware.checkUser ,EmailController.getBinEmails);
router.get('/drafts/:id',  middleware.checkUser ,EmailController.getDraftEmails);
router.get('/snoozed/:id',  middleware.checkUser ,EmailController.getScheduledEmails);
router.get('/spam/:id',  middleware.checkUser ,EmailController.getSpamEmails);
router.get('/allmail/:id',  middleware.checkUser ,EmailController.getAllEmails);
router.post('/bin/:idUserActuel',  middleware.checkUser ,EmailController.drop); // Ajout de la route pour spprimer un email 
router.post('/undoDelete/:id',  middleware.checkUser ,EmailController.UndoDelete);  // Ajout de la route pour récupérer depuis la corbeille

router.get('/:id', middleware.checkUser ,EmailController.getEmailById); //Route pour récupérer un e-mail par son ID en utilisant la méthode HTTP GET 
router.post('/readed',  middleware.checkUser ,EmailController.readed); //ajout de la route pour marquer un mail comme lu
router.post('/starredMail/:id' , EmailController.toggleStarredEmail); //ajout de la route pour marquer un mail comme favoris
router.post('/transfer/:id', upload.array('files', 20), EmailController.transferEmail); //ajout de la route pour transférer un email 
router.post('/reply/:id', upload.array('files', 20), EmailController.reply); //ajout de la route pour répondre à un email 
// Route pour ajouter un email en brouillon
router.post('/addDrafts/:id', upload.array('files', 20), EmailController.addDraftEmail);
// Route pour mettre à jour un email en brouillon
router.put('/drafts/:id', upload.array('files', 20), EmailController.updateDraftEmail);
//route pour servir les pièces jointes
router.get('/serveAttachment/:filename', EmailController.serveAttachment); 
// j'ai ajouter la route pour annuler l'envoi programmé d'un email
router.post('/cancelScheduled/:id', EmailController.cancelScheduledEmail);

router.post('/gethistorique/:id', EmailController.gethistorique); 
// Export du module de routage configuré
module.exports = router;