async function createPost(req, res, prisma){
    let newPost = await prisma.Posts.create({
        data :{
            author : req.user.user_id,
            data : req.file.filename
        }
    })
 // TODO : fix this code , make one like insert to the db , 
 // this is for temporary soluction
 console.log(req.body.data)   
 let body = JSON.parse(req.body.data)
    
    body.data.forEach( async ele => {
        let tag = await prisma.Tags.create({
            data :{
                tagName : ele,
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
    console.log(newPost)
    console.log(JSON.parse (req.body.data))
}
async function getPost(req , res , prisma){
    console.log("get post")
   let posts = await prisma.$queryRaw`select * from public."Posts" where id in(select post from public."Activity" where author in (select reciever from public."Friends" where sender = ${req.user.user_id}))`
   console.log(posts)
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
module.exports =  { createPost ,getPost , likePost}