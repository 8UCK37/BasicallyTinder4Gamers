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

async function createThemesInDatabase(prisma) {

  const themesList = [
    {
      "name": "Space",
      "navBg": "https://i.imgur.com/G64meFi.gif",
      "homeBg": "https://i.imgur.com/U2zdk2m.jpeg",
      "profileBg": "https://i.imgur.com/p1qu6rB.jpeg",
      "accentColor": null,
      "compColor": null
    },
    {
      "name": "Gaming",
      "navBg": "https://i.imgur.com/cPn4jq9.gif",
      "homeBg": "https://i.imgur.com/4YyLazB.gif",
      "profileBg": "https://i.imgur.com/3gVfeol.gif",
      "accentColor": null,
      "compColor": null
    },
    {
      "name": "Nature",
      "navBg": "https://i.imgur.com/3hlUUWV.gif",
      "homeBg": "https://i.imgur.com/IxsQTOr.gif",
      "profileBg": "https://i.imgur.com/bqyQ33j.gif",
      "accentColor": null,
      "compColor": null
    },
    {
      "name": "Action",
      "navBg": null,
      "homeBg": "https://i.imgur.com/7lGXbtO.jpeg",
      "profileBg": "https://i.imgur.com/6q6GgIK.jpeg",
      "accentColor": null,
      "compColor": null
    }
  ];

  for (let index = 0; index < themesList.length; index++) {
    const theme = themesList[index];
    await prisma.Themes.create({
      data: {
        name: theme.name,
        navBg: theme.navBg,
        homeBg: theme.homeBg,
        profileBg: theme.profileBg,
        accentColor: theme.accentColor,
        compColor: theme.compColor
      }
    });
  }
  console.log("profile helper 123: Themes have been created.");
}

module.exports =  { upProfilePic,upBanner,createThemesInDatabase}