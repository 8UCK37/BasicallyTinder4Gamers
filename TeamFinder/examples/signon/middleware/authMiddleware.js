 function ensureAuthenticated(req, res, next) {
    var admin = require("firebase-admin");
  
    var serviceAccount = require("./../../../key/firebaseadminkey.json");
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
  
      });
    } else {
      admin.app()
    }
  
    const { getAuth } = require("firebase-admin/auth")
    if (req.headers['authorization'] == null) {
      res.sendStatus(400);
      return;
    }
    let idToken = req.headers['authorization'].split(" ")[1]
  
    getAuth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        req.user = decodedToken
        next();
        // console.log(decodedToken);
        // console.log(uid)
        // ...
      })
      .catch((error) => {
        // Handle error
  
        console.log(error)
        res.sendStatus(403)
  
      });
  
    // res.sendStatus(200)
  }

module.exports = {ensureAuthenticated}