const mongoose = require ('mongoose');

mongoose
       .connect ('mongodb+srv://'+ process.env.DB_USER_PASS + '@cluster0.rezvrxr.mongodb.net/MailWalker',)
      .then(() => console.log('Connected to MongoDB'))
      .catch((err) => console.log("failed to connect to MongoDB", err));