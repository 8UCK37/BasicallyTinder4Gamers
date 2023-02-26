const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
async function execute(io , socketUserMap ,  userSocketMap){
    io.on('connection', (socket) => {
        console.log('a user connected' , socket.id);
        
        socket.on('setSocketId', async (msg) => {
          console.log('setSocket id' , msg.name, "====>"  , socket.id );
          socketUserMap.set(socket.id,msg.name)
          userSocketMap.set(msg.name,socket.id)
          try{
          const updateStatus = await prisma.user.update({
            where: {
              id: msg.name,
            },
            data: {
              isConnected: true,
            },
          })
          console.log(socketUserMap)
        }catch(err){
            console.log("probs new user")
          }
        });
        socket.on('disconnect', async () => {
          console.log('user disconnected with soc id: '+socket.id);
          //console.log(socketUserMap.get(socket.id))
          try{
          const updateStatus = await prisma.user.update({
            where: {
              id: socketUserMap.get(socket.id),
            },
            data: {
              isConnected: false,
            },
          })
          socketUserMap.delete(socket.id)
          console.log(socketUserMap)
        }catch(err){
          console.log("probs new user disc lol")
        }
        });
        
        socket.on('my message', async (receivedData) => {
          console.log(receivedData)
          let receiver = receivedData.receiver ;
          let receivedSocketId = userSocketMap.get(receiver)
          let sender = receivedData.sender
      
          // console.log(sender)
          console.log(socketUserMap)
          chatData = await prisma.Chat.create({
            data:{
              sender: sender,
              receiver: receiver,
              msg: receivedData.msg
            }
          })
          console.log(chatData)
          console.log(sender , " msg koreche  user " , receivedSocketId)
          io.to(receivedSocketId).emit('my broadcast' , {sender:receivedData.sender,msg:receivedData.msg});
          // io.emit('my broadcast', `server: ${msg}`);
        });
      });       
}

module.exports = { execute }