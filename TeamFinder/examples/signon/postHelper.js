const {Storage} = require('@google-cloud/storage')
const bucketName = 'gs://teamfinder-e7048.appspot.com/';
const { v4: uuidv4 } = require('uuid');

// Imports the Google Cloud Node.js client library
async function createPost(req, res, prisma){
    //console.log(req.file);
    if(req.file){
    const newUUID = uuidv4();
    const destFileName = 'Posts/'+newUUID+'.jpg';
    //console.log(myUUID);
    //console.log(req.body.data.desc)
    let body = JSON.parse(req.body.data)
    //console.log(body.desc)  
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
                data : {photoUrl:`https://firebasestorage.googleapis.com/v0/b/teamfinder-e7048.appspot.com/o/Posts%2F${newUUID}.jpg?alt=media&token=13a7d5b5-e441-4a5f-8204-60aff096a1bf`,desc:body.desc}
            }
        })
     // TODO : fix this code , make one like insert to the db , 
     // this is for temporary soluction
     //console.log(req.body.data)   
    
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

        // console.log(req.file)
    //console.log(newPost)
    //console.log(JSON.parse (req.body.data))
    }
}

async function getPost(req , res , prisma){
   console.log("get post")
   let posts = await prisma.$queryRaw`select * from public."Posts" where id in(select post from public."Activity" where author in (select reciever from public."Friends" where sender = ${req.user.user_id}))`
   console.log(posts)
   res.send(JSON.stringify(posts))
}
async function getOwnPost(req , res , prisma){
  console.log("get post")
  
  let posts = await prisma.$queryRaw`select * from public."Posts" where author=${req.user.user_id}`
  
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
async function upBanner(req, res, prisma){
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