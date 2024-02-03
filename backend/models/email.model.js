// Import du module mongoose pour la gestion des modèles de données MongoDB
const mongoose = require('mongoose');

const EmailFolderSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    starred: {
        type: Boolean,
        default: false
    },
    read: {
        type: Boolean,
        default: false
    }
  });

// Définition du schéma de données(modèle) pour les e-mails
const emailSchema = new mongoose.Schema({
  // Champ "from" de type String, obligatoire (required) 
  from: { 
    type: String, 
    required: true 
  },
  // Champ "to" de type String, obligatoire
  to: { 
    type: String, 
    required: true
  },
  //Champ "cc" de type String
  cc: {
    type: String
  },
  // Champ "subject" de type String
  subject: { 
    type: String,
  },
  // Champ "body" de type String
  body: { 
    type: String,
    default:" "
  },
  //Champ "idLastEmail" de type String qui stock l'id du mail à transférer
  idLastEmail: {
    type: String ,
    required: false 
  },
  folders: [EmailFolderSchema],
  //Champ "emaildeleted" indique si un email a été supprimé une fois par un utilisateur s'il est à True
  emaildeleted :{
    type: Boolean,
    default: false 
  },
  //Champ scheduledAt de type date pour l'envoi programmé , par défaut est à null
  scheduledAt: {
    type: Date,
    default: null, // Peut être null si non programmé
  },
  //Champ SchedledIsSent de type booléen qui indique si l'email programmé a été envoyé 
  SchedledIsSent: {
    type: Boolean,
    default: false,
  },
  //Champ "isSpam" indique si un email est un spam s'il est à true
  isSpam: {
  type: Boolean,
  default: false
  },
  // Nouveau champ pour stocker le chemin de la pièce jointe
  fichiers: [{
    type: mongoose.Schema.Types.Object,
    filename: String,
    path: String,
    require: true
  }],
  //brouillon
  isDraft: {
    type: Boolean,
    default: false,
  }
},
{
    timestamps: true, // Ajoute automatiquement des champs de timestamp (createdAt, updatedAt)
}
);

// Création du modèle Email basé sur le schéma défini
const EmailModel = mongoose.model('Emails', emailSchema);

// Export du modèle Email pour pouvoir l'utiliser ailleurs dans l'application
module.exports = EmailModel;