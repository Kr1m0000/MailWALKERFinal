// Import du module mongoose pour la gestion des modèles de données MongoDB
const mongoose = require('mongoose');

// Définition du schéma de données(modèle) pour les e-mails
const ArchivedEmailSchema = new mongoose.Schema({
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
  // Champ "subject" de type String
  subject: { 
    type: String 
  },
  // Champ "body" de type String
  body: { 
    type: String 
  },
  timestamps:{
   type:Date
  }
},
{ 
    timestamps: true, // Ajoute automatiquement des champs de timestamp (createdAt, updatedAt)
}
);

// Création du modèle Email basé sur le schéma défini
const ArchivedEmails = mongoose.model('ArchivedEmails', ArchivedEmailSchema);

// Export du modèle Email pour pouvoir l'utiliser ailleurs dans l'application
module.exports = ArchivedEmails;
