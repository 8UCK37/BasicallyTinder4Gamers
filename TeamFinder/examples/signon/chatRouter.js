const {Storage} = require('@google-cloud/storage')
const bucketName = 'gs://teamfinder-e7048.appspot.com/';


async function upChatBackGround(req, res){
  console.log(req.file);
  if(req.file){
  const destFileName = 'ChatBackground/'+req.user.user_id+'.jpg';
  //console.log(myUUID);
      const storage = new Storage();
      async function uploadFromMemory() {
          await storage.bucket(bucketName).file(destFileName).save(req.file.buffer);
        
          console.log(
            `${destFileName}  uploaded to ${bucketName}.`
          );
        }
        uploadFromMemory().catch(console.error);      
  }
}

module.exports =  {upChatBackGround}