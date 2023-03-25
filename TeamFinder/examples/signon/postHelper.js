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
  SELECT DISTINCT p.*, t.tagNames, u."name", u."profilePicture",
    CASE WHEN EXISTS (
      SELECT *
      FROM public."Activity" a
      WHERE a.author = ${req.user.user_id} AND a.type = 'like' AND a.post = p.id
    ) THEN true ELSE false END AS likedByCurrentUser,
    CASE WHEN EXISTS (
      SELECT *
      FROM public."Activity" a
      WHERE a.author = ${req.user.user_id} AND a.type = 'haha' AND a.post = p.id
    ) THEN true ELSE false END AS hahaedbycurrentUser,
    CASE WHEN EXISTS (
      SELECT *
      FROM public."Activity" a
      WHERE a.author = ${req.user.user_id} AND a.type = 'love' AND a.post = p.id
    ) THEN true ELSE false END AS lovedbycurrentUser,
    CASE WHEN EXISTS (
      SELECT *
      FROM public."Activity" a
      WHERE a.author = ${req.user.user_id} AND a.type = 'sad' AND a.post = p.id
    ) THEN true ELSE false END AS sadedbycurrentUser,
    CASE WHEN EXISTS (
      SELECT *
      FROM public."Activity" a
      WHERE a.author = ${req.user.user_id} AND a.type = 'poop' AND a.post = p.id
    ) THEN true ELSE false END AS poopedbycurrentUser,
    CASE WHEN NOT EXISTS (
    SELECT *
    FROM public."Activity" a
    WHERE a.author = ${req.user.user_id} AND a.type IN ('like', 'haha', 'love', 'sad', 'poop') AND a.post = p.id
  ) THEN true ELSE false END AS noReaction
  FROM public."Posts" p
  LEFT JOIN (
    SELECT post, STRING_AGG("tagName", ',') AS tagNames
    FROM public."Tags"
	 GROUP BY "post"
  ) t ON p.id = t.post
  LEFT JOIN public."Activity" a ON p.id = a.post
  LEFT JOIN public."User" u ON p.author = u.id
  WHERE a.author IN (
    SELECT f.reciever
    FROM public."Friends" f
    WHERE f.sender = ${req.user.user_id}
  )
  
  ORDER BY p."createdAt" DESC;
`;
  res.send(JSON.stringify(posts));
}

async function getPostById(req, res, prisma) {
  console.log("get post")
  let posts = await prisma.$queryRaw`
    SELECT p.*, t.tagNames, u.name,u."profilePicture", 
    CASE WHEN EXISTS (
      SELECT *
      FROM public."Activity" a
      WHERE a.author = ${req.user.user_id} AND a.type = 'like' AND a.post = p.id
    ) THEN true ELSE false END AS likedByCurrentUser,
    CASE WHEN EXISTS (
      SELECT *
      FROM public."Activity" a
      WHERE a.author = ${req.user.user_id} AND a.type = 'haha' AND a.post = p.id
    ) THEN true ELSE false END AS hahaedbycurrentUser,
    CASE WHEN EXISTS (
      SELECT *
      FROM public."Activity" a
      WHERE a.author = ${req.user.user_id} AND a.type = 'love' AND a.post = p.id
    ) THEN true ELSE false END AS lovedbycurrentUser,
    CASE WHEN EXISTS (
      SELECT *
      FROM public."Activity" a
      WHERE a.author = ${req.user.user_id} AND a.type = 'sad' AND a.post = p.id
    ) THEN true ELSE false END AS sadedbycurrentUser,
    CASE WHEN EXISTS (
      SELECT *
      FROM public."Activity" a
      WHERE a.author = ${req.user.user_id} AND a.type = 'poop' AND a.post = p.id
    ) THEN true ELSE false END AS poopedbycurrentUser,
    CASE WHEN NOT EXISTS (
    SELECT *
    FROM public."Activity" a
    WHERE a.author = ${req.user.user_id} AND a.type IN ('like', 'haha', 'love', 'sad', 'poop') AND a.post = p.id
  ) THEN true ELSE false END AS noReaction
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
    SELECT
      u.name,
      u."profilePicture",
      t.*,
      p.*,
      CASE WHEN EXISTS (
        SELECT *
        FROM public."Activity" a
        WHERE a.author = ${req.user.user_id} AND a.type = 'like' AND a.post = p.id
      ) THEN true ELSE false END AS likedByCurrentUser,
      CASE WHEN EXISTS (
        SELECT *
        FROM public."Activity" a
        WHERE a.author = ${req.user.user_id} AND a.type = 'haha' AND a.post = p.id
      ) THEN true ELSE false END AS hahaedByCurrentUser,
      CASE WHEN EXISTS (
        SELECT *
        FROM public."Activity" a
        WHERE a.author = ${req.user.user_id} AND a.type = 'love' AND a.post = p.id
      ) THEN true ELSE false END AS lovedByCurrentUser,
      CASE WHEN EXISTS (
        SELECT *
        FROM public."Activity" a
        WHERE a.author = ${req.user.user_id} AND a.type = 'sad' AND a.post = p.id
      ) THEN true ELSE false END AS sadedByCurrentUser,
      CASE WHEN EXISTS (
        SELECT *
        FROM public."Activity" a
        WHERE a.author = ${req.user.user_id} AND a.type = 'poop' AND a.post = p.id
      ) THEN true ELSE false END AS poopedByCurrentUser,
      CASE WHEN NOT EXISTS (
        SELECT *
        FROM public."Activity" a
        WHERE a.author = ${req.user.user_id} AND a.type IN ('like', 'haha', 'love', 'sad', 'poop') AND a.post = p.id
      ) THEN true ELSE false END AS noReaction
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
      if(req.body.type=='like'){
        console.log('in-like')
        let updateCount = await prisma.Posts.update({
            where: { 
                id: req.body.id
                },
            data: { 
                fire_count: { increment: 1 } 
                },
        })
      }else if(req.body.type=='haha'){
        console.log('in-haha')
        let updateCount = await prisma.Posts.update({
          where: { 
              id: req.body.id
              },
          data: { 
              haha_count: { increment: 1 } 
              },
        })
      }else if(req.body.type=='love'){
        console.log('in-love')
        let updateCount = await prisma.Posts.update({
          where: { 
              id: req.body.id
              },
          data: { 
              love_count: { increment: 1 } 
              },
        })
      }else if(req.body.type=='sad'){
        console.log('in-sad')
        let updateCount = await prisma.Posts.update({
          where: { 
              id: req.body.id
              },
          data: { 
              sad_count: { increment: 1 } 
              },
        })

      }else if(req.body.type=='poop'){
        console.log('in-poop')
        let updateCount = await prisma.Posts.update({
          where: { 
              id: req.body.id
              },
          data: { 
              poop_count: { increment: 1 } 
              },
        })
      }
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
        if(check[0].type=='like'){
          console.log('de-like')
          let updateCount = await prisma.Posts.update({
              where: { 
                  id: req.body.id
                  },
              data: { 
                  fire_count: { decrement: 1 } 
                  },
          })
        }else if(check[0].type=='haha'){
          console.log('de-haha')
          let updateCount = await prisma.Posts.update({
            where: { 
                id: req.body.id
                },
            data: { 
                haha_count: { decrement: 1 } 
                },
          })
        }else if(check[0].type=='love'){
          console.log('de-love')
          let updateCount = await prisma.Posts.update({
            where: { 
                id: req.body.id
                },
            data: { 
                love_count: { decrement: 1 } 
                },
          })
        }else if(check[0].type=='sad'){
          console.log('de-sad')
          let updateCount = await prisma.Posts.update({
            where: { 
                id: req.body.id
                },
            data: { 
                sad_count: { decrement: 1 } 
                },
          })

        }else if(check[0].type=='poop'){
          console.log('de-poop')
          let updateCount = await prisma.Posts.update({
            where: { 
                id: req.body.id
                },
            data: { 
                poop_count: { decrement: 1 } 
                },
          })
        }
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
  if(req.body.type=='like'){
    console.log('de-like')
    let updateCount = await prisma.Posts.update({
        where: { 
            id: req.body.id
            },
        data: { 
            fire_count: { decrement: 1 } 
            },
    })
  }else if(req.body.type=='haha'){
    console.log('de-haha')
    let updateCount = await prisma.Posts.update({
      where: { 
          id: req.body.id
          },
      data: { 
          haha_count: { decrement: 1 } 
          },
    })
  }else if(req.body.type=='love'){
    console.log('de-love')
    let updateCount = await prisma.Posts.update({
      where: { 
          id: req.body.id
          },
      data: { 
          love_count: { decrement: 1 } 
          },
    })
  }else if(req.body.type=='sad'){
    console.log('de-sad')
    let updateCount = await prisma.Posts.update({
      where: { 
          id: req.body.id
          },
      data: { 
          sad_count: { decrement: 1 } 
          },
    })

  }else if(req.body.type=='poop'){
    console.log('de-poop')
    let updateCount = await prisma.Posts.update({
      where: { 
          id: req.body.id
          },
      data: { 
          poop_count: { decrement: 1 } 
          },
    })
  }
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




module.exports =  { createPost,getPost,likePost,dislikePost,getPostById,getPostByTags,getLatestPost}