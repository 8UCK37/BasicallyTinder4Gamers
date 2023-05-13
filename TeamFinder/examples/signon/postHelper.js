const {Storage} = require('@google-cloud/storage')
const bucketName = 'gs://teamfinder-e7048.appspot.com/';
const { v4: uuidv4 } = require('uuid');
const socketRunner = require('./sockerRunner')

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
      console.log(body);
      let text = "" 
      mentionList = [] 
      body.desc.ops.forEach(element => {
        // console.log(element.insert)
        if(element.insert.mention == undefined ){
          text += element.insert
        }

        else{
          text += element.insert.mention.id
          mentionList.push({id : element.insert.mention.id, name: element.insert.mention.value});
        }
      });
      console.log("51 : text -> " , text , mentionList)
      // return ;
      // let newPost = await prisma.Posts.$queryRaw``;
          let newPost = await prisma.Posts.create({
            data :{
                author : req.user.user_id,
                photoUrl:urlArr.toString(),
                description:text,
                deleted:false,
                mention: {list : mentionList}
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
       r.likeCount, r.hahaCount, r.sadCount, r.loveCount, r.poopCount,
       CASE 
        WHEN p.shared IS NULL THEN NULL 
        WHEN pp.deleted = true THEN '{"deleted":"true","message": "This post is no longer available"}'
        ELSE row_to_json(pp)::text 
        END AS ParentPost,
       json_build_object('name', pu."name", 'profilePicture', pu."profilePicture") as parentPostAuthor
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
LEFT JOIN public."Posts" pp ON pp.id = p.shared
LEFT JOIN public."User" pu ON pp.author = pu.id
WHERE EXISTS (
    SELECT 1
    FROM public."Friends" f
    WHERE f.sender = ${req.user.user_id} AND f.reciever = p.author
)AND p.deleted = false
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
    CASE 
        WHEN p.shared IS NULL THEN NULL 
        WHEN pp.deleted = true THEN '{"deleted":"true","message": "This post is no longer available"}'
        ELSE row_to_json(pp)::text 
        END AS ParentPost,
        json_build_object('name', pu."name", 'profilePicture', pu."profilePicture") as parentPostAuthor,
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
    LEFT JOIN public."Posts" pp ON pp.id = p.shared
    LEFT JOIN public."User" pu ON pp.author = pu.id
    WHERE p.author=${req.body.uid} AND p.deleted=false
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
        ) AND deleted = false 
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

async function deletePost(req,res,prisma){
  console.log('post id to delete',parseInt(req.body.id))

  let deletePost = await prisma.Posts.updateMany({
      where:{
        id:parseInt(req.body.id)
      },
      data:{
        deleted:true
      }
  })

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

async function mentionedInPost(req, res, prisma){
  //console.log(req.body.mentionlist)
  const io = req.app.get('socketIo')
  req.body.mentionlist.forEach(ele => {
    //console.log(ele.id)
    socketRunner.sendNotification(io,"new mention", req.user.user_id, ele.id)
  });
res.send(JSON.stringify({status: 'ok'}))
}


async function getPostByPostId(req, res, prisma){
  //console.log(req.body.postId)
  postid=parseInt(req.body.postId)
  const post = await prisma.$queryRaw`
  SELECT p.*, t.tagNames, u."name", u."profilePicture", a.type AS reactionType,
       CASE WHEN a.type IS NULL THEN true ELSE false END AS noReaction,
       r.likeCount, r.hahaCount, r.sadCount, r.loveCount, r.poopCount,
       CASE WHEN p.shared IS NULL THEN NULL WHEN pp.deleted = true THEN '{"deleted":"true","message": "This post is no longer available"}'
        ELSE row_to_json(pp)::text END AS ParentPost,
        json_build_object('name', pu."name", 'profilePicture', pu."profilePicture") as parentPostAuthor
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
  LEFT JOIN (
      SELECT post, type, author
      FROM public."Activity"
      WHERE type != 'post'
  ) a ON p.id = a.post AND a.author = ${req.user.user_id}
  LEFT JOIN public."User" u ON p.author = u.id
  LEFT JOIN public."Posts" pp ON pp.id = p.shared
  LEFT JOIN public."User" pu ON pp.author = pu.id
  WHERE p.id = ${postid} AND p.deleted = false
  ORDER BY p."createdAt" DESC;
`;
res.send(JSON.stringify(post))
}
async function quickSharePost(req, res, prisma){
  console.log(req.user.user_id)
  console.log(req.body.originalPostId)
  let quickShare = await prisma.Posts.create({
    data:{
      author : req.user.user_id,
      photoUrl:null,
      description:null,
      deleted:false,
      mention: {data:'null'},
      shared : parseInt(req.body.originalPostId)
    }
  })
  res.sendStatus(200)
}

module.exports =  { createPost,getPost,likePost,dislikePost,getPostById,getPostByTags,getLatestPost,
                    deletePost,mentionedInPost,getPostByPostId,quickSharePost}