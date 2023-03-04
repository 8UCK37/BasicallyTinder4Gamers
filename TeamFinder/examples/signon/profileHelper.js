const {Storage} = require('@google-cloud/storage')
const bucketName = 'gs://teamfinder-e7048.appspot.com/';


async function upProfilePic(req, res, prisma){
  console.log(req.file);
  if(req.file){
  const destFileName = 'ProfilePicture/'+req.user.user_id+'.jpg';
  //console.log(myUUID);
      const storage = new Storage();
      async function uploadFromMemory() {
          await storage.bucket(bucketName).file(destFileName).save(req.file.buffer);
        
          console.log(
            `${destFileName}  uploaded to ${bucketName}.`
          );
        }
        uploadFromMemory().catch(console.error);      
        const updateUser = await prisma.User.update({
          where: {
            id: req.user.user_id,
          },
          data: {
            profilePicture: `https://firebasestorage.googleapis.com/v0/b/teamfinder-e7048.appspot.com/o/ProfilePicture%2F${req.user.user_id}.jpg?alt=media&token=13a7d5b5-e441-4a5f-8204-60aff096a1bf`,
          },
        }) 
  }

}

// async function downProfilePic(req, res, prisma){
//   console.log(req.user);
//   console.log("called")
//   const destFileName = 'ProfilePicture/'+req.user.user_id+'.jpg';
//   //console.log(myUUID);
//       const storage = new Storage();
//       async function uploadFromMemory() {
//           await storage.bucket(bucketName).file(destFileName).download("https://lh3.googleusercontent.com/a/AGNmyxYrMz3_UNXetTtvTilKGbU7dasRf0rhfFTnWoyDsA=s96-c");
      
//           console.log(
//             `${destFileName}  uploaded to ${bucketName}.`
//           );
//         }
//         uploadFromMemory().catch(console.error);      

// }

async function upBanner(req, res,prisma){
  console.log(req.file);
  if(req.file){
  const destFileName = 'ProfileBanner/'+req.user.user_id+'.jpg';
  //console.log(myUUID);
      const storage = new Storage();
      async function uploadFromMemory() {
          await storage.bucket(bucketName).file(destFileName).save(req.file.buffer);
        
          console.log(
            `${destFileName}  uploaded to ${bucketName}.`
          );
        }
        uploadFromMemory().catch(console.error);
        const updateUser = await prisma.User.update({
          where: {
            id: req.user.user_id,
          },
          data: {
            profileBanner: `https://firebasestorage.googleapis.com/v0/b/teamfinder-e7048.appspot.com/o/ProfileBanner%2F${req.user.user_id}.jpg?alt=media&token=13a7d5b5-e441-4a5f-8204-60aff096a1bf`,
          },
        })        
  }
}
module.exports =  { upProfilePic,upBanner}