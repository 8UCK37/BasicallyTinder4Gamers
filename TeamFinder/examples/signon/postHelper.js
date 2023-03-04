const {Storage} = require('@google-cloud/storage')
const bucketName = 'gs://teamfinder-e7048.appspot.com/';
const { v4: uuidv4 } = require('uuid');

// Imports the Google Cloud Node.js client library
async function createPost(req, res, prisma){
    let body = JSON.parse(req.body.data)
    //console.log(body.data);
    console.log(req.files);
    var urlArr = [];
    
    if(req.files){
      const storage = new Storage();
      req.files.forEach(file => {
        console.log(file)
        const newUUID = uuidv4();
        const destFileName = 'Posts/'+newUUID+'.jpg';
        const url=`https://firebasestorage.googleapis.com/v0/b/teamfinder-e7048.appspot.com/o/Posts%2F${newUUID}.jpg?alt=media&token=13a7d5b5-e441-4a5f-8204-60aff096a1bf`
        urlArr.push(url)
        
        async function uploadFromMemory() {
            await storage.bucket(bucketName).file(destFileName).save(file.buffer);
            console.log(
              `${destFileName}  uploaded to ${bucketName}.`
            );
          }
          uploadFromMemory().catch(console.error);
      });
    //console.log(urlArr.toString())
    
    //console.log(myUUID);
    //console.log(req.body.data.desc)
      
          let newPost = await prisma.Posts.create({
            data :{
                author : req.user.user_id,
                photoUrl:urlArr.toString(),
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
   let posts=await prisma.$queryRaw`SELECT p.*, t.tagNames, u."name", u."profilePicture"
   FROM public."Posts" p
   LEFT JOIN (
     SELECT post, STRING_AGG("tagName", ',') AS tagNames
     FROM public."Tags"
     GROUP BY "post"
   ) t ON p.id = t.post
   LEFT JOIN public."Activity" a ON p.id = a.post
   LEFT JOIN public."User" u ON a.author = u.id
   WHERE a.author IN (
     SELECT f.reciever
     FROM public."Friends" f
     WHERE f.sender = ${req.user.user_id}
   )
   ORDER BY p."createdAt" DESC;`
   //console.log(posts)
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
   //console.log(posts)
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


async function getPostByTags(req, res,prisma){
  console.log(req.query)
  let param = req.query.tags;
  let postsByTag = await prisma.$queryRaw`select t.* , p.* from (select * from public."Posts" where id in  
  (SELECT post FROM public."Tags" where "tagName" = ${param} )) as p left join (SELECT post, STRING_AGG("tagName", ',') AS tagNames
      FROM public."Tags"
      GROUP BY "post") as t on p.id = t.post;`
  res.send(JSON.stringify(postsByTag))
}
module.exports =  { createPost,getPost,likePost,getOwnPost,getPostByTags}