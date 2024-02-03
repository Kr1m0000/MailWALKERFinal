// Import du modèle Email depuis le fichier email.model.js
//vrai code
const EmailModel = require('../models/email.model');
const UserModel = require('../models/user.model');
const ArchivedEmailsModel = require('../models/ArchivedEmails.model');
const ObjectID = require('mongoose').Types.ObjectId;
const cron = require('node-cron');
const moment = require('moment');
const validator= require('validator');
const path = require('path');
const fs = require('fs');
//Fonction qui ajoute l'id de l'email crée au champ des user
function champ(emailId, from, to, cc) {

    try {
        const senderUser = from; //on récupère l'utilisateur expéditeur
        let userinfo = UserModel.findOneAndUpdate({ email: senderUser }, {
            //ajout de l'id de l'email envoyé au champ sentEmails du document Users(pour l'utilisateur expéditeur)
            $addToSet: { sentEmails: emailId }
        }).exec();

        const receivedUser = UserModel.findOneAndUpdate({ email: to }, {//on récupère le récepteur User
            //ajout de l'id de l'email reçu au champ receivedEmails du document Users(pour l'utilisateur récepteur)
            $addToSet: { receivedEmails: emailId }
        }).exec();

        if (cc) {
            tableaucc = cc.split(/\s+/);
            for (let j = 0;j < tableaucc.length ; j++) {
                const onecc =  tableaucc[j];
            if (validator.isEmail(onecc)){
            const receivedUser = UserModel.findOneAndUpdate({ email:  onecc }, {//on récupère le récepteur User
                //ajout de l'id de l'email reçu au champ receivedEmails du document Users(pour l'utilisateur récepteur)
                $addToSet: { receivedEmails: emailId }
            }).exec();
        }}
    }

    } catch (err) { console.log(err); }
}
// Fonction pour envoyer un e-mail
module.exports.sendEmail = async (req, res) => {

    let to, cc, subject, body, files, scheduledAt ;
    let emailId, emaildraft,email,updatedEmailDraft, idemailforTransfer;
    const idEmaildraft = req.body.idEmaildraft;
    let listeto;
    if(idEmaildraft){
        //envoi depuis draft
        console.log('ca viens du draft');
        emaildraft = await EmailModel.findById(idEmaildraft);
        listeto= req.body.to;
        cc= req.body.cc;
        scheduledAt= req.body.scheduledAt;
    }else{
        //envoi normal
        listeto= req.body.to;
        cc= req.body.cc;
        subject= req.body.subject;
        body= req.body.body;
        files = req.files;
        scheduledAt= req.body.scheduledAt;  
        idemailforTransfer =req.body.idemailforTransfer;  
    }

    if(idemailforTransfer){
        const emailforTransfer= await EmailModel.findById(idemailforTransfer); 
        const  fileToTransfer =emailforTransfer.fichiers;

        files= files.concat( fileToTransfer );
    }

    const regexEmail = /\S+@\S+\.\S+/;
    const tableauDeTo = listeto.split(/\s+/);
    // Filtrer les adresses e-mail
    const adressesEmail = tableauDeTo.filter((contenutableauDeTo) => regexEmail.test(contenutableauDeTo));


    const idSender = req.params.idUser;

    try {
        for (let i = 0; i < adressesEmail.length ; i++) {
            const to =  adressesEmail[i];

        if (validator.isEmail(to)){
        // Vérification si l'expéditeur existe dans la base de données
        const senderUser = await UserModel.findById(idSender);
        const from = senderUser.email;
        if (!senderUser) {
            res.status(400).json({ error: "L'expéditeur n'existe pas." });
        }
        // Vérification si le destinataire existe dans la base de données
        if (!to || !validator.isEmail(to)) {
            res.json("Please enter a valid email !");
        } else {
            const receiverUser = await UserModel.findOne({ email: to });
            if (!receiverUser) {
                res.json("The recipient does not exist !");
            } else {
                // Vérifier si le corps de l'email contient des mots-clés de spam
                const isSpam = checkForSpam(subject, body);

                // Convertir scheduledAt en objet Date 
                const scheduledDate = scheduledAt
                // Création d'une nouvelle instance d'e-mail avec les données fournies
               
               if (idEmaildraft){
                updatedEmailDraft= await EmailModel.findByIdAndUpdate(
                    idEmaildraft,
                    { isDraft: false ,  $set: { 'folders.1.user': receiverUser._id}},
                    { new: true }
                );

               }else {
                
                email = await EmailModel.create({
                    from, to, cc, subject, body, isSpam, scheduledAt: scheduledDate,
                    folders: [
                        { user: idSender, starred: false, read: false },
                        { user: receiverUser._id, starred: false, read: false },],
                    fichiers: files.map(file => ({ 
                        filename: file.filename,
                        path: file.path
                    }))
                });
                 emailId = email._id;
               }
              
                // Récupération de l'ID de l'e-mail envoyé

                if (!scheduledDate) {
                    if (emailId) {
                        champ(emailId, from, to, cc)
                    }else if (updatedEmailDraft){
                        champ(emaildraft._id, emaildraft.from, emaildraft.to, emaildraft.cc)
                    }
                } else { 
                    if (emailId) {
                        scheduleEmail(email._id, scheduledDate);
                    }else if (updatedEmailDraft){
                        scheduleEmail(emaildraft._id, scheduledDate);
                    }
                   
                    //res.status(201).json({ email: email._id });
                }

                // Réponse avec le statut 201 (Created) et l'ID de l'e-mail créé
                res.status(201).json('');
            }
        }
                
    }
    }
    } catch (err) {
        // En cas d'erreur, réponse avec le statut 400 (Bad Request) et l'erreur
        // res.status(400).json({ err }); 
    }

};
function checkForSpam(subject, body) {
    // Liste d'expressions régulières associées au spam 
    const spamPatterns = [
        /\boffre\s*\S*\s*exclusive\b/i, /\bgagner\s*de\s*l'argent\b/i, /\bgratuit\b/i, /\bprêt\b/i, /\bloterie\b/i
    ];

    // Vérification dans le sujet de l'email
    const subjectIsSpam = spamPatterns.some(pattern => pattern.test(subject));

    // Vérification dans le corps de l'email
    const bodyIsSpam = spamPatterns.some(pattern => pattern.test(body));

    // Retourne true si l'un des deux est vrai
    const isSpam = subjectIsSpam || bodyIsSpam;
    return isSpam;
}
// Fonction pour récupérer un e-mail par son ID
module.exports.getEmailById = async (req, res) => {
    try {
        // Extraction de l'ID de l'e-mail des paramètres de la requête
        const emailId = req.params.id;
        // Recherche de l'e-mail par son ID
        const email = await EmailModel.findById(emailId);
        // Vérification si l'e-mail a été trouvé
        if (!email) {
            // Si l'e-mail n'est pas trouvé, réponse avec le statut 404 (Not Found)
            return res.status(404).json({ error: 'Email non trouvé' });
        }
        // Réponse avec le statut 200 (OK) et l'e-mail récupéré
        console.log(email._id);
        res.status(200).json(email);
    } catch (error) {
        // Réponse avec le statut 500 (Internal Server Error) et un message d'erreur
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'e-mail' });
    }
};
// Fonction pour récupérer tous les e-mails envoyés par un utilisateur spécifique
module.exports.getSentEmails = async (req, res) => {
    if( req.params.id){
    try {
        // Obtenir l'id de l'expéditeur depuis le corps de la requête
        const idUserSender = req.params.id;
        // Recherche de tous les e-mails envoyés par un expéditeur spécifié
        const user = await UserModel.findOne({ _id: idUserSender });
        // liste des id des email envoyés par cet expéditeur
        const idListEmails = user.sentEmails;
        // selectionner les email dont les id sont sur sentEmails user 
        const SentEmails = await EmailModel.find({ _id: { $in: idListEmails } });

        // Réponse avec le statut 200 (OK) et la liste des e-mails envoyés
        res.status(200).json(SentEmails);

    } catch (error) {
        // En cas d'erreur lors de la récupération des e-mails envoyés
        // Réponse avec le statut 500 (Internal Server Error) et un message d'erreur
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des e-mails envoyés' });
    }

}
};
// Fonction pour récupérer tous les e-mails reçus par un utilisateur spécifique
module.exports.getReceivedEmails = async (req, res) => {
    if ( req.params.id) {
    try {
            const idUserReceiver = req.params.id;
            // Recherche de tous les e-mails reçus pour un récepteur spécifié
            const user = await UserModel.findById(idUserReceiver);
            // liste des id des email reçu par ce récepteur
            const idListEmails = user.receivedEmails;
            // selectionner les email dont les id sont sur receivedEmails user 
            const ReceivedEmails = await EmailModel.find({ _id: { $in: idListEmails }, isSpam: false }); 
            // Réponse avec le statut 200 (OK) et la liste des e-mails reçus
            res.status(200).json(ReceivedEmails);
    } catch (error) {
        // En cas d'erreur lors de la récupération des e-mails reçus
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des e-mails reçus' });
    }
}
};
//Fonction pour la suppression d'un email (déplacer vers la corbeille, ou supprimer définitivement cad l'archiver)
module.exports.drop = async (req, res) => {
    const idUserActuel = req.params.idUserActuel; // id de l'utilisateur actuel récupéré depuis le body
    const arrayEmailIdToDrop = req.body.emailIdToDrop; // liste des id d'email à supprimer 
    const user = await UserModel.findById(idUserActuel) // stocker sur user les information de l'utilisateur actuel
    const list = user.sentEmails // la liste des id des email envoyé par cet utilisateur

    const listbin = user.binEmails; // la liste des Id des email mis dans la corbeille 

    try {
        let emailIdToDrop;
        for (var index in arrayEmailIdToDrop) {
            emailIdToDrop = arrayEmailIdToDrop[index];

            const emailtodelete = await EmailModel.findById(emailIdToDrop); // recuperer les informations d'email à supprimer
            if (listbin.includes(emailIdToDrop)) { // verifier si cet email est dans la corbeille de ce user

                if (emailtodelete.emaildeleted) { //verifier si le champ emaildeleted est a true 

                    user.updateOne({ $pull: { binEmails: emailIdToDrop } }).exec() // supprimer l'email de la corbeille
                    emailtodelete.deleteOne().exec();
                    //res.send(" email supprimé définitivement ")

                    //archivage d'email supprimé definitivement 
                    const from = emailtodelete.from;
                    const to = emailtodelete.to
                    const cc = emailtodelete.cc
                    const subject = emailtodelete.subject
                    const body = emailtodelete.body
                    const createdAt = emailtodelete.createdAt
                    const ok = ArchivedEmailsModel.create({ from, to, cc, subject, body, createdAt }); // creer un document archivedEmail qui stocke l'email supprimé
                    //res.send("Votre copie de cet email est supprimé")
                } else { // il est pas supprimé déja par l'autre user  
                    user.updateOne({ $pull: { binEmails: emailIdToDrop } }).exec()// on le supprime de la corbeille de cette user
                    emailtodelete.updateOne({ "emaildeleted": true }).exec() // on modifie le champ emaildeleted a true=> marque que ce mail était supprimé une fois
                    res.send("Votre copie de cet email est supprimé")
                }
            } else { // cet email n'est pas dans la corbeille de cet utilisateur 

                //si c'est un brouillon alors mettre emaildeleted à True pour pouvoir le supprimer definitivement à sa 2ème suppression
                if (emailtodelete.isDraft) {
                    emailtodelete.updateOne({ "emaildeleted": true }).exec()
                };

                user.updateOne({ $addToSet: { binEmails: emailIdToDrop } }).exec()// on l'ajoute a sa corbeille
                if (list.includes(emailIdToDrop)) {  //  tester si l'id de cet email est dans la liste des id d'email envoyé par ce user
                    user.updateOne(
                        { $pull: { sentEmails: emailIdToDrop } } // supprimer l'id de cet email de la liste des email envoyé
                    ).exec();
                }
                else { // alors l'id de cet email est dans la liste des email reçu 
                    user.updateOne({ $pull: { receivedEmails: emailIdToDrop } }).exec()  // supprimer l'id de cette email de la liste des email recu
                };
               // res.send("email placé dans la corbeille")
            }
        }
        res.json()
    } catch (err) {
        console.log(err);
        res.json("Erreur lors de la suppression d'email")
    }
};
//fonction pour annuler la suppression d'un email (le récupérer depuis la corbeille)
module.exports.UndoDelete = async (req, res) => {
    const idUserActuel = req.params.id; // id de l'utilisateur actuel récupéré depuis le body
    //const emailInBin = req.body.emailInBin; // id de l'email supprimé qu'on veux récupéré (dans la corbeille) 
    const arrayemailInBin = req.body.emailInBin; // liste des id d'email à récupéré
    const user = await UserModel.findById(idUserActuel)
    //const emailToRestore = await EmailModel.findById(emailInBin)
    try {
        let emailInBin;
        for (var index in arrayemailInBin) {
            emailInBin = arrayemailInBin[index];

            const emailToRestore = await EmailModel.findById(emailInBin)
            //si c'est un brouillon alors mettre emaildeleted à false 
            if (emailToRestore.isDraft) {
                emailToRestore.updateOne({ $set: { emaildeleted: false } }).exec()
            } else {
                if (emailToRestore.from == user.email) {
                    user.updateOne({ $addToSet: { sentEmails: emailInBin } }).exec()
                } else {
                    user.updateOne({ $addToSet: { receivedEmails: emailInBin } }).exec()
                }
            }

            user.updateOne({ $pull: { binEmails: emailInBin } }).exec();
           
        }
         res.send("récuperation reussi")
    } catch (err) {
        res.send("erreur de récuperation")
    }
};
//Fonction pour marquer un email comme favoris
module.exports.toggleStarredEmail = async (req, res) => {
    try {
        const emailId = req.body.emailId; // ID de l'e-mail à marquer comme favori

        if (!emailId) {
            return res.status(400).json({ error: 'Missing emailId field.' });
        }
        const user = await UserModel.findById(req.params.id)
        // Mettre à jour le champ 'starred' du dossier de l'utilisateur spécifié dans l'e-mail
        let val;
        const emailSt = await EmailModel.findById(emailId);
        if ((emailSt.from) == (user.email)) {
            val = emailSt.folders[0].starred;
        } else {
            val = emailSt.folders[1].starred;
        }

        const updatedEmail = await EmailModel.findOneAndUpdate(
            { _id: emailId, 'folders.user': user._id },
            { 'folders.$.starred': !val },
            { new: true }
        )
        //Vérifier si l'e-mail a été trouvé et mis à jour
        if (!updatedEmail) {
            return res.status(404).json({ error: 'Email not found or not authorized.' });
        }

        // Répondre avec l'e-mail mis à jour
        // res.json(updatedEmail);
    } catch (error) {
        console.error('Error toggling starred status:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
// Fonction pour marquer un email comme lu
module.exports.readed = async (req, res) => {

    const emailUser = req.body.emailUser;
    const emailId = req.body.emailId;
    const em = await EmailModel.findOneAndUpdate(
        { _id: emailId, 'folders.user': emailUser },
        { 'folders.$.read': true }
    ).exec().then(() => { res.send("Message marqué comme lu !") })
};
//Fontion pour répondre à un email
module.exports.reply = async (req, res) => {
    let files;
    console.log('sur reply');
    const idemail = req.body.idemail; // l'id de l'email sur lequel on répond 
    const idUser = req.params.id // id du user actuel

    const subject = req.body.subject; // subject de la réponse
    const body = req.body.body; // body de la réponse
    const cc = req.body.cc;

    const user = await UserModel.findById(idUser); // information du user
    const email = await EmailModel.findById(idemail); // information du mail sur lequel on répond
    const idLastEmail = email._id // id du mail sur lequel on répond
    let from; let to; // initialisation du from et to 
    if (email.from == user.email) {  // si c'est verifé veut dire que il répond a un email qui a lui meme envoyé
        from = user.email;
        to = user.email
    } else {
        from = email.to
        to = email.from;
    }
    if (req.files) {
        files = req.files; 
    }
    const nvemail = new EmailModel({
        from, to, cc, subject, body, folders: [
            { user: to, starred: false, read: false },
            { user: from, starred: false, read: false },
        ], idLastEmail,

        fichiers: files.map(file => ({ // Notez que nous utilisons `files` pour stocker un tableau
            filename: file.filename,
            path: file.path
        }))
    })
    const emailsaved = await nvemail.save()
        .then(champ(nvemail._id, from, to, cc,))

        .catch((err) => { console.log("erreur lors de la sauvegard", err); })
    res.send("ok")
}
// Fonction pour transférer un email 
module.exports.transferEmail = async (req, res) => {
    console.log('sur transfer');
    const { emailId, to, from, subject, body } = req.body;
    const id= req.params.id;

    try {
        // Récupérer les données de l'e-mail à transférer
        // const originalEmail = await EmailModel.findById(emailId);

        // if (!originalEmail) {
        //     return res.status(404).json({ message: 'Email not found' });
        // }

        // // Récupérer l'adresse e-mail du nouveau récepteur
        // const emailReceiver = await UserModel.findById(receiverId);

        // Utiliser les données de l'e-mail original comme valeurs par défaut
        // const { to, cc, subject, body } = originalEmail;

        // // Concaténer les nouvelles valeurs si elles sont fournies avec les valeurs par défaut
        // const updatedSubject = newSubject ? `${subject ? subject + '\n' : ''}${newSubject}` : subject;
        // const updatedBody = newBody ? `${body ? body + '\n' : ''}${newBody}` : body;

        // Récupérer les données du nouveau mail avec des valeurs modifiables
        const updatedEmailData = {
            from,
            to:to,
            cc,
            subject: subject,
            body: updatedBody,
            idLastEmail: emailId
        };

        // Créer une nouvelle instance d'e-mail avec les données du nouvel e-mail
        const newEmail = new EmailModel(updatedEmailData);

        // Sauvegarder les modifications
        await newEmail.save();

        // Mettre à jour les références dans le modèle User
        const senderUser = await UserModel.findOneAndUpdate(
            { id:id },
            { $addToSet: { sentEmails: newEmail._id } }
        ).exec();

        const receiverUser = await UserModel.findOneAndUpdate(
            { email: newEmail.to },
            { $addToSet: { receivedEmails: newEmail._id } }
        ).exec();

        // Répondre avec le statut 200 (OK) et l'ID du nouvel e-mail créé
        return res.status(200).json({ email: newEmail._id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
// Fonction pour planifier l'envoi d'un e-mail
async function scheduleEmail(emailId, scheduledAt) {
    try {
        // Récupérer l'e-mail à planifier
        let emailToSchedule = await EmailModel.findById(emailId).exec();
        if (!emailToSchedule) {
            console.log('Email not found');
            return;
        }
        // Mettre à jour la date programmée dans l'e-mail
        emailToSchedule.scheduledAt = scheduledAt;
        // Planifier la vérification de la date programmée avec node-cron
        const funct = cron.schedule(`*/01 * * * * *`, async () => {
            // Exécuter la logique de vérification de la date programmée ici
            const currentDate = new Date();
            const dateLocaleGMTplus1 = moment(currentDate).utcOffset('+0100').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
            const scheduleddate = moment(scheduledAt).utcOffset('+0100').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

            if (dateLocaleGMTplus1 > scheduleddate) {
              emailToSchedule = await EmailModel.findById(emailId).exec();
              if(!emailToSchedule.scheduledAt){
                setTimeout(() => {
                  funct.stop();
              }, 1);
              }else{
                emailToSchedule.updateOne({ $set: { SchedledIsSent: true } }).exec()
                champ(emailId, emailToSchedule.from, emailToSchedule.to, emailToSchedule.cc);
                // Arrêt de la tâche planifiée
                setTimeout(() => {
                    funct.stop();
                }, 1);
              }
                

            }
        });
    } catch (error) {
        console.log('Erreur de programmation de l\'email:', error);
    }
};
//créer brouilon 
module.exports.addDraftEmail = async (req, res) => {

    const idCurrentuser = req.params.id;
    try {
        let to = req.body.to;
        const subject = req.body.subject;
        const body = req.body.body;
        const cc = req.body.cc ;

        let fichiers = [];
        if (req.files) {
            fichiers = req.files.map(file => ({
                filename: file.filename,
                path: file.path
            }));
        }

        if ((to !== undefined &&/\S/.test(to) )
        || (subject !== undefined && /\S/.test(subject)) 
        || (body !== undefined && /\S/.test(body) )
        || (cc !== undefined && /\S/.test(cc))) {
          if(!to){to="Empty Recipients !"}
            const user = await UserModel.findById(idCurrentuser);
            const from = user.email;
            const newEmailModel = new EmailModel({
                from, to, cc, subject, body,
                folders: [
                    { user: idCurrentuser, starred: false, read: false },
                    { user: ' ', starred: false, read: false }
                ],
                isDraft: true,
                fichiers,
            });
            const savedEmailModel = await newEmailModel.save();

            res.status(201).json(savedEmailModel);
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
//modifier brouillon
module.exports.updateDraftEmail = async (req, res) => {
    try {
        console.log('sur update draft');
        
        const id= req.params.id;
        console.log(id);
        const {to, subject, body, cc, scheduledAt } = req.body;
        let fichiers = [];
        const email =await EmailModel.findById(id) ;
        if (req.files) {
            fichiers = req.files.map(file => ({
                filename: file.filename,
                path: file.path
            }));

            const  updatefile=fichiers.concat(email.fichiers)
            console.log(updatefile);
             const updatedEmailModel = await email.updateOne(
               { $set :{ to, subject, body, cc ,scheduledAt, fichiers:updatefile}},
                 { new: true }, 
             ).exec();
             
            }else{
                 const updatedEmailModel = await email.updateOne(
                     {$set  : { to, subject, body, cc ,scheduledAt}},
                     { new: true }, ).exec();
            }

        res.status(200).json(updatedEmailModel);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Fonction pour servir une pièce jointe à partir de la base de données
module.exports.serveAttachment = async (req, res) => {
    try {
        const filename = req.params.filename;

        // Chemin complet du fichier
        let fullPath = path.join('\..\controllers\email.controller.js', '..', 'uploads', filename);
        fullPath = path.resolve(fullPath);

        // Vérifier si le fichier existe
        if (fs.existsSync(fullPath)) {
            //console.log("fullPath",fullPath);
            res.sendFile(fullPath);
        } else {
            res.status(404).send('Fichier non trouvé');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la pièce jointe :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de la pièce jointe' });
    }
};
module.exports.getStarredEmails = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id)
        const idListEmails = user.sentEmails;
        sEmails = await EmailModel.find({ _id: { $in: idListEmails }, 'folders.0.starred': true });
        rEmails = await EmailModel.find({ _id: { $in: user.receivedEmails }, 'folders.1.starred': true });
        dEmails = await EmailModel.find({ from: user.email, 'folders.0.starred': true , isDraft:true});
        const StarredEmails = sEmails.concat(rEmails).concat(dEmails);
        res.status(200).json(StarredEmails);
    } catch (error) {
        // Réponse avec le statut 500 (Internal Server Error) et un message d'erreur
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des e-mails starred' });
    }
}
module.exports.getBinEmails = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id)
        const idListEmails = user.binEmails;
        bEmails = await EmailModel.find({ _id: { $in: idListEmails } });

        res.status(200).json(bEmails);

    } catch (error) {
        // Réponse avec le statut 500 (Internal Server Error) et un message d'erreur
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des e-mails supprimé' });
    }
}
module.exports.getDraftEmails = async (req, res) => {
    try {
        const idCurrentuser = req.params.id;
        const user = await UserModel.findById(req.params.id);
        draftEmails = await EmailModel.find({ from: user.email, isDraft: true, emaildeleted: false })
        res.status(200).json(draftEmails);

    } catch (error) {
        // Réponse avec le statut 500 (Internal Server Error) et un message d'erreur
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des e-mails brouillons' });
    }
};
module.exports.getScheduledEmails = async (req, res) => {
    try {

        const idCurrentuser = req.params.id;
        const user = await UserModel.findById(idCurrentuser);
        scheduledEmails = await EmailModel.find({from:user.email, scheduledAt : { $ne: null }, SchedledIsSent: false }) 
        res.status(200).json(scheduledEmails);
    } catch (error) {
        // Réponse avec le statut 500 (Internal Server Error) et un message d'erreur
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des e-mails planifié' });
    }
};
module.exports.getSpamEmails = async (req, res) => { 
    try {
        const idCurrentuser = req.params.id;
        const user = await UserModel.findById(idCurrentuser);
        spamEmails = await EmailModel.find({ _id: { $in: user.receivedEmails }, isSpam: true, emaildeleted: false }) 
        res.status(200).json(spamEmails); 
    } catch (error) {
        // Réponse avec le statut 500 (Internal Server Error) et un message d'erreur
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des e-mails spam' });
    }
};
module.exports.getAllEmails = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        sEmails = await EmailModel.find({ _id: { $in: user.sentEmails } });
        rEmails = await EmailModel.find({ _id: { $in: user.receivedEmails } , isSpam : false });
        dEmails = await EmailModel.find({ from: user.email, isDraft: true })
        
        const allEmails = sEmails.concat(rEmails).concat(dEmails);
        res.status(200).json(allEmails);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de tous les e-mails ' });
    }
}
// Fonction pour annuler l'envoi d'un e-mail planifié
module.exports.cancelScheduledEmail = async (req, res) => {

    try {
        const emailId = req.params.id;
        // Récupérer l'e-mail à annuler
        const emailToCancel = await EmailModel.findById(emailId).exec();
        if (!emailToCancel) {
            console.log('Email not found');
            return;
        }

        if (emailToCancel.scheduledAt!=null){ 
            // Mettre à jour les champs pour annuler l'envoi programmé
        emailToCancel.updateOne({ $set: { scheduledAt: null ,isDraft: true }}).exec()
        }
        res.status(200).json(emailToCancel);
    } catch (error) {
        console.log('Error canceling scheduled email:', error);
    }
}

async function emailById (id){
    const email = await EmailModel.findById(id);
    if (email) {
        return(email)
    }else{
        return
    }
  
}

module.exports.gethistorique = async (req, res)=>{
    const id=req.params.id; 
    if(id!=''){
        try{ 
            let emails=[];
            let email = await emailById(id);   
            emails.push(email);

        while (email.idLastEmail){   
            email = await emailById(email.idLastEmail) 
            emails.push(email);
        }
        emails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(emails)
        }catch(err){
        // res.json(err)
        }
    }
} 