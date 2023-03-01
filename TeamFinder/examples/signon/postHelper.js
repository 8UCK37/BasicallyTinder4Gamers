const {Storage} = require('@google-cloud/storage')
const bucketName = 'gs://teamfinder-e7048.appspot.com/';
const { v4: uuidv4 } = require('uuid');

// Imports the Google Cloud Node.js client library
async function createPost(req, res, prisma){
    console.log(req.file);
    if(req.file){
    const newUUID = uuidv4();
    const destFileName = 'Posts/'+newUUID+'.jpg';
    //console.log(myUUID);
    //console.log(req.body.data.desc)
    let body = JSON.parse(req.body.data)
    console.log(body.data)  
        const storage = new Storage();
        async function uploadFromMemory() {
            await storage.bucket(bucketName).file(destFileName).save(req.file.buffer);
            console.log(
              `${destFileName}  uploaded to ${bucketName}.`
            );
          }
          uploadFromMemory().catch(console.error);
          
          let newPost = await prisma.Posts.create({
            data :{
                author : req.user.user_id,
                photoUrl:`https://firebasestorage.googleapis.com/v0/b/teamfinder-e7048.appspot.com/o/Posts%2F${newUUID}.jpg?alt=media&token=13a7d5b5-e441-4a5f-8204-60aff096a1bf`,
                description:body.desc
            }
        })
     // TODO : fix this code , make one like insert to the db , 
     // this is for temporary soluction
      
    
        body.data.forEach( async ele => {
            let tag = await prisma.Tags.create({
                data :{
                    tagName : ele.display,
                    post : newPost.id
                }
            })
        });
        let activity = await prisma.Activity.create({
            data :{
                post : newPost.id,
                weight : 1,
                author : req.user.user_id,
                type : 'post'
            }
        })
    }
}

async function getPost(req , res , prisma){
   console.log("get post")
   
   let posts=await prisma.$queryRaw`SELECT p.*, t.tagNames
   FROM public."Posts" p
   LEFT JOIN (
     SELECT post, STRING_AGG("tagName", ',') AS tagNames
     FROM public."Tags"
     GROUP BY "post"
   ) t ON p.id = t.post
   WHERE p.id IN (
     SELECT a.post
     FROM public."Activity" a
     WHERE a.author IN (
       SELECT f.reciever
       FROM public."Friends" f
       WHERE f.sender = ${req.user.user_id}
     )
   )
   ORDER BY p."createdAt" DESC;`
   console.log(posts)
   res.send(JSON.stringify(posts))
}
async function getOwnPost(req , res , prisma){
  console.log("get post")
  let posts=await prisma.$queryRaw`SELECT p.*, t.tagNames
   FROM public."Posts" p
   LEFT JOIN (
     SELECT post, STRING_AGG("tagName", ',') AS tagNames
     FROM public."Tags"
     GROUP BY "post"
   ) t ON p.id = t.post
   WHERE p.author=${req.user.user_id}
   ORDER BY  p."createdAt" DESC;`
  res.send(JSON.stringify(posts))
}

async function likePost(req, res, prisma){
    // console.log("post liked")
    // console.log()
    let activity = await prisma.Activity.create({
        data :{
            post :  parseInt(req.query.id),
            weight : 1,
            author : req.user.user_id,
            type : 'like'
        }
    })
    res.send(JSON.stringify({status: 'ok'}))
}


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


async function upBanner(req, res){

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
module.exports =  { createPost,getPost,likePost,upProfilePic,upBanner,getOwnPost}