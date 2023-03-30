const {Storage} = require('@google-cloud/storage')
const bucketName = 'gs://teamfinder-e7048.appspot.com/';
const { v4: uuidv4 } = require('uuid');


BigInt.prototype.toJSON = function() {
  return this.toString();
}
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
                description:body.desc,
                fire_count:0,
                haha_count:0,
                love_count:0,
                sad_count:0,
                poop_count:0
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

async function getPost(req, res, prisma) {
  console.log("get post for",req.user.user_id);
  const posts = await prisma.$queryRaw`
  SELECT p.*, t.tagNames, u."name", u."profilePicture", a.type AS reactionType,
       CASE WHEN a.type IS NULL THEN true ELSE false END AS noReaction,
       r.likeCount, r.hahaCount, r.sadCount, r.loveCount, r.poopCount
FROM public."Posts" p
LEFT JOIN (
    SELECT post,
           COUNT(*) FILTER (WHERE type = 'like') AS likeCount,
           COUNT(*) FILTER (WHERE type = 'haha') AS hahaCount,
           COUNT(*) FILTER (WHERE type = 'sad') AS sadCount,
           COUNT(*) FILTER (WHERE type = 'love') AS loveCount,
           COUNT(*) FILTER (WHERE type = 'poop') AS poopCount
    FROM public."Activity"
    GROUP BY post
) r ON r.post = p.id
LEFT JOIN (
    SELECT post, STRING_AGG("tagName", ',') AS tagNames
    FROM public."Tags"
    GROUP BY "post"
) t ON p.id = t.post
LEFT JOIN public."Activity" a ON p.id = a.post AND a.author = ${req.user.user_id}
LEFT JOIN public."User" u ON p.author = u.id
WHERE EXISTS (
    SELECT 1
    FROM public."Friends" f
    WHERE f.sender = ${req.user.user_id} AND f.reciever = p.author
)
ORDER BY p."createdAt" DESC;


`;
  res.send(JSON.stringify(posts));
}

async function getPostById(req, res, prisma) {
 
  console.log("get post")
  let posts = await prisma.$queryRaw`
    SELECT p.*, t.tagNames, u.name,u."profilePicture", 
    (
      SELECT a.type
      FROM public."Activity" a
      WHERE a.author = ${req.user.user_id} AND a.post = p.id
    ) AS reactionType,
    CASE WHEN NOT EXISTS (
      SELECT *
      FROM public."Activity" a
      WHERE a.author = ${req.user.user_id} AND a.type IN ('like', 'haha', 'love', 'sad', 'poop') AND a.post = p.id
    ) THEN true ELSE false END AS noReaction,
  (SELECT COUNT(*) FROM public."Activity" WHERE post = p.id AND type = 'like') AS likeCount,
  (SELECT COUNT(*) FROM public."Activity" WHERE post = p.id AND type = 'haha') AS hahaCount,
  (SELECT COUNT(*) FROM public."Activity" WHERE post = p.id AND type = 'sad') AS sadCount,
  (SELECT COUNT(*) FROM public."Activity" WHERE post = p.id AND type = 'love') AS loveCount,
  (SELECT COUNT(*) FROM public."Activity" WHERE post = p.id AND type = 'poop') AS poopCount
    FROM public."Posts" p
    LEFT JOIN (
      SELECT post, STRING_AGG("tagName", ',') AS tagNames
      FROM public."Tags"
      GROUP BY "post"
    ) t ON p.id = t.post
    JOIN public."User" u ON p.author = u.id
    WHERE p.author=${req.body.uid}
    ORDER BY p."createdAt" DESC;
  `
  res.send(JSON.stringify(posts))
}


async function getLatestPost(req, res, prisma) {
  console.log("get latest post")
  let posts = await prisma.$queryRaw`
    SELECT p.*, t.tagNames,u.*
    FROM public."Posts" p
    LEFT JOIN (
      SELECT post, STRING_AGG("tagName", ',') AS tagNames
      FROM public."Tags"
      GROUP BY "post"
    ) t ON p.id = t.post
    JOIN public."User" u ON p.author = u.id
    WHERE p.author=${req.user.user_id}
    ORDER BY p."createdAt" DESC
    LIMIT 1;
  `
  res.send(JSON.stringify(posts))
}

async function getPostByTags(req, res, prisma) {
  let param = req.body.tags;
  let postsByTag = await prisma.$queryRaw`
    SELECT u.name,u."profilePicture",t.*,p.*,
    (
      SELECT a.type
      FROM public."Activity" a
      WHERE a.author = ${req.user.user_id} AND a.post = p.id
    ) AS reactionType,
    CASE WHEN NOT EXISTS (
      SELECT *
      FROM public."Activity" a
      WHERE a.author = ${req.user.user_id} AND a.type IN ('like', 'haha', 'love', 'sad', 'poop') AND a.post = p.id
    ) THEN true ELSE false END AS noReaction,
  (SELECT COUNT(*) FROM public."Activity" WHERE post = p.id AND type = 'like') AS likeCount,
  (SELECT COUNT(*) FROM public."Activity" WHERE post = p.id AND type = 'haha') AS hahaCount,
  (SELECT COUNT(*) FROM public."Activity" WHERE post = p.id AND type = 'sad') AS sadCount,
  (SELECT COUNT(*) FROM public."Activity" WHERE post = p.id AND type = 'love') AS loveCount,
  (SELECT COUNT(*) FROM public."Activity" WHERE post = p.id AND type = 'poop') AS poopCount
    FROM
      (
        SELECT *
        FROM public."Posts"
        WHERE id IN (
          SELECT post
          FROM public."Tags"
          WHERE "tagName" = ${param}
        )
      ) AS p
      LEFT JOIN public."User" AS u ON p.author = u.id
      LEFT JOIN (
        SELECT post, STRING_AGG("tagName", ',') AS tagNames
        FROM public."Tags"
        GROUP BY "post"
      ) AS t
      ON p.id = t.post;
  `;
  res.send(JSON.stringify(postsByTag));
}



async function likePost(req, res, prisma){
    // console.log("post liked")
    console.log(parseInt(req.body.id))
    console.log(req.body.type)
    let check = await prisma.Activity.findMany({
      where:{
        post :  parseInt(req.body.id),
        author : req.user.user_id,
      }
      })
      
      if(check.length!=0){
        console.log("found",check[0].type)
        let activityUpdate = await prisma.Activity.updateMany({
          where:{
            post :  parseInt(req.body.id),
            author : req.user.user_id,
          },
          data:{
            type:req.body.type
          }
          })
      }else{console.log('not found')
      let activity = await prisma.Activity.create({
        data :{
            post :  parseInt(req.body.id),
            weight : 2,
            author : req.user.user_id,
            type : req.body.type
      }
        })
      }
        
  res.send(JSON.stringify({status: 'ok'}))
}

async function dislikePost(req, res, prisma){
  // console.log("post liked")
  console.log(parseInt(req.body.id))
  console.log(req.body.type)
  let activity = await prisma.Activity.updateMany({
      where :{
          post :  parseInt(req.body.id),
          author : req.user.user_id,
      },data:{
        type:'dislike'
      }
  })
  
res.send(JSON.stringify({status: 'ok'}))
}


module.exports =  { createPost,getPost,likePost,dislikePost,getPostById,getPostByTags,getLatestPost}