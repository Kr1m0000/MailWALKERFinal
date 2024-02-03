const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const validator = require('validator');


console.log('updateController:', updateController);



module.exports.updatePassword = async (userId, currentPassword, newPassword, res) => {
    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(401).send({ error: "User Not Found...!" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ error: "Invalid current password" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { password: hashedNewPassword }, { new: true });

        return res.status(200).send({ msg: "Password update successful...!", user: updatedUser });
    } catch (error) {
        console.error('Error during password update:', error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};


module.exports.updatePseudo = async (userId, pseudo, res) => {
    try {
        const existingUser = await UserModel.findOne({ pseudo });

        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).send({ error: "Pseudo already taken" });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(userId, { pseudo }, { new: true });

        return res.status(200).send({ msg: "Pseudo update successful...!", user: updatedUser });
    } catch (error) {
        console.error('Error during pseudo update:', error);
        return res.status(500).send({ error: 'Internal Server Error', error })
    }
};


module.exports.updateBasic = async (userId, data, res) => {
    try {
        const { trustedEmail, firstName, lastName, phoneNumber, gender, birthdate } = data;
        const body = { firstName, lastName, phoneNumber, gender, birthdate };

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
