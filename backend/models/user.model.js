const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  { 
    firstName: {
      type: String,
      
    },
    lastName: {
      type: String,
     
    },
    birthdate: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'], 
    },
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    trustedEmail: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
     
      trim: true,
    },
    resetToken:{
      type: String,
    },
    resetTokenExpiration:{
      type: Date,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6
    },
    secretQuestion: {
      type: String,
    
    },
    secretAnswer: {
      type: String,
      max: 1024,
    
    },
    phoneNumber: {
      type: String,
    },
    otpCode: {
      type: String,
    },
    otpCodeExpiration:{
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png"
    },
    bio :{
      type: String,
      max: 1024,
    },
    sentEmails: {
      type: [String]
    },
    receivedEmails: {
      type: [String]
    },
    binEmails: {
      type: [String]
    },
    Notes: {
      type: [String]
    },
    binNotes: {
      type: [String]
    }  
  },
  {
    timestamps: true,
  }
);

// play function before save into display: 'block',
// play function before save into display: 'block',
userSchema.pre("save", async function(next) {
  try {
    // Vérifier si le mot de passe a été modifié (ou si c'est une création d'utilisateur)
    if (!this.isModified("password")) {
      return next();
    }

    // Générer un sel et hacher le mot de passe
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre("save", async function(next) {
  try {
    if (!this.isModified("secretAnswer") || !this.secretAnswer) {
      return next();
    }

    const salt = await bcrypt.genSalt();
    const hashedSecretAnswer = await bcrypt.hash(this.secretAnswer, salt);
    this.secretAnswer = hashedSecretAnswer;
    next();
  } catch (error) {
    next(error);
  }
});

// play function before save into display: 'block',



userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  //console.log('User found:', user);
  
  if (user) {
    // Afficher le mot de passe fourni lors de la connexion
    //console.log('Password provided during login:', password);
    //console.log('Password provided length:', password.length);

    // Afficher le mot de passe stocké dans la base de données
    //console.log('Stored password in the database:', user.password);
    //console.log('Stored password length:', user.password.length);
    //console.log('Password provided during login:', password);

    // Afficher le hachage du mot de passe fourni
    const hashedPasswordProvided = await bcrypt.hash(password, 10);
    //console.log('Hashed password provided:', hashedPasswordProvided);

    const auth = await bcrypt.compare(password, user.password);
    //console.log('Password comparison result:', auth);
  
    if (auth) {
      return user;
    }
    throw Error('Mot de passe incorrect');
  }
  throw Error('Email incorrect');
};



const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;