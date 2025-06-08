const {Storage} = require('@google-cloud/storage')
const bucketName = 'gs://teamfinder-e7048.appspot.com/';
const { v4: uuidv4 } = require('uuid');
const socketRunner = require('./socketRunner')
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
async function uploadChatImage(req, res,prisma){
  console.log(req.file);
  let body = JSON.parse(req.body.data)
  const io = req.app.get('socketIo')
  //console.log('incoming chat',body);
  if(req.file){
      const storage = new Storage();
      const newUUID = uuidv4();
      const destFileName = 'ChatImages/'+newUUID+'.jpg';
      async function uploadFromMemory() {
          await storage.bucket(bucketName).file(destFileName).save(req.file.buffer);
        
          console.log(
            `${destFileName}  uploaded to ${bucketName}.`
          );
            
        const photoUrl=`https://firebasestorage.googleapis.com/v0/b/teamfinder-e7048.appspot.com/o/ChatImages%2F${newUUID}.jpg?alt=media&token=13a7d5b5-e441-4a5f-8204-60aff096a1bf`
          
        chatData = await prisma.Chat.create({
          data:{
            sender: body.data.sender,
            receiver: body.data.receiver,
            msg: body.data.msg,
            photoUrl:photoUrl
          }
        })
        console.log("here")
        socketRunner.sendNotification(io, "imageUploadDone", body.data.sender, body.data.receiver,photoUrl)  
        }
        uploadFromMemory().catch(console.error);            
  }else{
    //console.log('chat without images')
    chatData = await prisma.Chat.create({
      data:{
        sender: body.data.sender,
        receiver: body.data.receiver,
        msg: body.data.msg
      }
    })
  }
}
module.exports =  {upChatBackGround,uploadChatImage}