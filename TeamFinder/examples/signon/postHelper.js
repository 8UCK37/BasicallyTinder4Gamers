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
    // console.log(req.file)
    console.log(newPost)
    console.log(JSON.parse (req.body.data))
}
async function getPost(req , res , prisma){
    
   let posts = await prisma.Posts.findMany({
    
   }); 
   res.send(JSON.stringify(posts))
}

module.exports =  { createPost ,getPost }