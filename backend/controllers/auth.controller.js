const UserModel =require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');
const nodemailer = require('../config/nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { generateAndSendOTP } = require('./otp.controller');

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
   return jwt.sign({id}, process.env.TOKEN_SECRET,{
      expiresIn: maxAge
   })
}

module.exports.signUp = async (req,res) => {
   console.log(req.body);
   const {firstName, lastName, birthdate, gender, pseudo, email, trustedEmail, password, phoneNumber, secretAnswer, secretQuestion,picture} = req.body;
   if (secretQuestion && !secretAnswer) {
    return res.status(400).json({error: 'secretAnswer'});
          
  }
   try {
    const user = await UserModel.create({firstName, lastName, birthdate, gender, pseudo, email, trustedEmail, password, phoneNumber, secretAnswer, secretQuestion,picture});
    res.status(201).json({  
      user: user._id, 
      pseudo: user.pseudo,
      email: user.email,
      picture: user.picture,})
   }
   catch (err) {
    const errors = signUpErrors(err);
    res.status(200).send({errors})
   }
}

module.exports.signIn = async (req, res) => {
   const {email, password} = req.body
   try {
      const user = await UserModel.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, {httpOnly: true, maxAge});
      res.status(200).json({
        user: user._id,
        name: user.name,
        pseudo:user.pseudo,
        email: user.email,
        picture: user.picture,
        trustedEmail: user.trustedEmail,
        secretQuestion: user.secretQuestion,
        secretAnswer: user.secretAnswer,
        isOnline: user.isOnline,})
   }
   catch (err) {
      const errors = signInErrors(err);
      res.status(200).json({errors});
   }
}

module.exports.logOut = (req, res) => {
   res.cookie('jwt', '',{maxAge: 1});
   res.redirect('/');

}

// Fonction pour générer un code OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Route pour demander la réinitialisation du mot de passe
exports.demanderResetMotDePasse = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const trustedEmail = user.trustedEmail;

        // Générer un code OTP
        const otp = generateOTP();

        // Envoyer le code par e-mail
        await nodemailer.sendMail({
            from: 'mailwalker.noreply@gmail.com',
            to: trustedEmail,
            subject: 'Réinitialisation du mot de passe',
            text: `Votre code de réinitialisation du mot de passe est : ${otp}`,
        });

        // Mettre à jour le modèle utilisateur avec le code OTP et sa date d'expiration
        user.resetToken = otp;
        user.resetTokenExpiration = Date.now() + 5 * 60 * 1000; // Expiration dans 5 minutes
        await user.save();

        res.status(200).json({ message: 'Un e-mail avec le code de réinitialisation a été envoyé à votre adresse de confiance' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation de mot de passe' });
    }
};

// Route pour réinitialiser le mot de passe avec le code OTP
exports.resetMotDePasse = async (req, res) => {
  const { email, otp, nouveauMotDePasse } = req.body;

  try {
    const user = await UserModel.findOne({
      email,
      resetToken: otp,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Code de réinitialisation invalide ou expiré' });
    }

    // Afficher le mot de passe avant le hachage
    console.log('Password before hashing:', nouveauMotDePasse);

    // Utiliser bcrypt.genSalt pour générer le sel
    const salt = await bcrypt.genSalt(10);
    
    // Utiliser bcrypt.hash pour générer le hachage avec le sel
    const hashedPassword = await bcrypt.hash(nouveauMotDePasse, salt);

    console.log('Updated password:', hashedPassword);

    await user.updateOne({password:hashedPassword})
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.status(200).json({ message: 'Le mot de passe a été réinitialisé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
  }
};

exports.getSecretQuestion = async (req, res) => {
   const { email } = req.body;
 
   try {
     const foundUser = await UserModel.findOne({ email });
     if (!foundUser) {
       return res.status(404).json({ message: 'Utilisateur non trouvé' });
     }
 
     res.json({ secretQuestion: foundUser.secretQuestion });
   } catch (error) {
     console.error('Erreur lors de la récupération de la question secrète :', error.message);
     res.status(500).send('Erreur serveur');
   }
 };
 
 exports.resetPasswordWithSecretAnswer = async (req, res) => {
  try {
    const { email, secretAnswer, newPassword } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    // Validate secret answer
    const isAnswerValid = await bcrypt.compare(secretAnswer, user.secretAnswer);

    if (isAnswerValid) {
      // Use bcrypt to hash the new password
      console.log('Password before hashing:', newPassword);

    // Utiliser bcrypt.genSalt pour générer le sel
    const salt = await bcrypt.genSalt(10);
    
    // Utiliser bcrypt.hash pour générer le hachage avec le sel
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    console.log('Updated password:', hashedPassword);

    await user.updateOne({password:hashedPassword})
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

      res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
    } else {
      // Incorrect secret answer
      res.status(401).json({ message: 'Réponses secrètes incorrectes.' });
    }
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe avec la réponse secrète :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.stepone = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await generateAndSendOTP(user);

    res.status(200).json({ message: 'Code de réinitialisation envoyé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation du mot de passe' });
  }
};

exports.steptwo = async (req, res) => {
  const { email, otp, nouveauMotDePasse } = req.body;

  try {
    const user = await UserModel.findOne({
      email,
      otpCode: otp,
    });

    if (!user) {
      return res.status(400).json({ message: 'Code de réinitialisation invalide ou expiré' });
    }

    console.log('Password before hashing:', nouveauMotDePasse);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nouveauMotDePasse, salt);

    console.log('Updated password:', hashedPassword);

    await user.updateOne({ password: hashedPassword });
    user.otpCode = null;
    user.otpCodeExpiration = null;
    await user.save();

    res.status(200).json({ message: 'Le mot de passe a été réinitialisé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
  }
};