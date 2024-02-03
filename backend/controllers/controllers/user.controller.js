const UserModel = require('../models/user.model');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;


module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = async (req, res) => {
    console.log(req.params);
    try {
        if (!ObjectID.isValid(req.params.id)) {
            return res.status(400).send("ID unknown: " + req.params.id);
        }
        const user = await UserModel.findById(req.params.id).select('-password').exec();
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user);
    } catch (err) {
        console.error('Error retrieving user information:', err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.updateUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const {firstName, lastName, trustedEmail, phoneNumber, gender, birthdate} = req.body;
      const body = { firstName, lastName, trustedEmail, phoneNumber, gender, birthdate };
  
     
        const user = await UserModel.findById(userId); 
      
  
      if (trustedEmail) {
        if (!validator.isEmail(trustedEmail)) {
          return res.status(400).send({ error: "Invalid trusted email" });
        }
  
        body.trustedEmail = trustedEmail;
      }
  
      const updatedUser = await UserModel.findByIdAndUpdate(userId, body, { new: true });
  
      if (!updatedUser) {
        return res.status(401).send({ error: 'Failed to update profile' });
      }
  
      return res.status(200).send({ msg: "Update successful...!", user: updatedUser });
    } catch (error) {
      console.error('Error during profile update:', error);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  };

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) 
        return res.status(400).send("ID unknown: " + req.params.id)

    try { 
        await UserModel.deleteOne({_id: req.params.id}).exec();
        res.status(200).json({message : "succesfully deleted. "});    
    }
    catch (err){
        res.status(500).json({ message: "Internal Server Error" });
    }
        
};