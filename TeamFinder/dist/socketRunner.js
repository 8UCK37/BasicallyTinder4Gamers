var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const socketUserMap = new Map();
const userSocketMap = new Map();
function execute(io) {
    return __awaiter(this, void 0, void 0, function* () {
        io.on('connection', (socket) => {
            console.log('a user connected', socket.id);
            socket.on('setSocketId', (msg) => __awaiter(this, void 0, void 0, function* () {
                console.log('setSocket id', msg.name, "====>", socket.id);
                socketUserMap.set(socket.id, msg.name);
                userSocketMap.set(msg.name, socket.id);
                // console.log("socketTousermap")
                // console.log(socketUserMap)
                // console.log("userTosocketmap")
                // console.log(userSocketMap)
                try {
                    const updateStatus = yield prisma.user.update({
                        where: {
                            id: msg.name,
                        },
                        data: {
                            isConnected: true,
                        },
                    });
                }
                catch (err) {
                    console.log("probs new user");
                }
                const friendlist = yield prisma.$queryRaw `select reciever from public."Friends" where sender =${socketUserMap.get(socket.id)}`;
                //console.log(friendlist)
                friendlist.forEach(frnd => {
                    let receiver = userSocketMap.get(frnd.reciever);
                    io.to(receiver).emit('notification', { sender: socketUserMap.get(socket.id), notification: 'online' });
                });
            }));
            socket.on('disconnect', () => __awaiter(this, void 0, void 0, function* () {
                console.log('user disconnected with soc id: ' + socket.id);
                const friendlist = yield prisma.$queryRaw `select reciever from public."Friends" where sender =${socketUserMap.get(socket.id)}`;
                //console.log(friendlist)
                friendlist.forEach(frnd => {
                    let receiver = userSocketMap.get(frnd.reciever);
                    io.to(receiver).emit('notification', { sender: socketUserMap.get(socket.id), notification: 'disc' });
                });
                try {
                    const updateStatus = yield prisma.user.update({
                        where: {
                            id: socketUserMap.get(socket.id),
                        },
                        data: {
                            isConnected: false,
                        },
                    });
                    socketUserMap.delete(socket.id);
                }
                catch (err) {
                    console.log("probs new user disc lol");
                }
            }));
            socket.on('my message', (receivedData) => __awaiter(this, void 0, void 0, function* () {
                console.log(receivedData);
                let receiver = receivedData.receiver;
                let receivedSocketId = userSocketMap.get(receiver);
                let sender = receivedData.sender;
                let photo = receivedData.photo;
                console.log(sender, " msg koreche  user ", receivedSocketId);
                io.to(receivedSocketId).emit('my broadcast', { sender: receivedData.sender, msg: receivedData.msg, photo: photo });
                // io.emit('my broadcast', `server: ${msg}`);
            }));
        });
    });
}
function sendNotification(io, notification, sender_id, receiver_id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let receiver = userSocketMap.get(receiver_id);
        console.log("func called");
        console.log(sender_id);
        console.log(receiver_id);
        console.log(userSocketMap);
        console.log(receiver);
        io.to(receiver).emit('notification', { sender: sender_id, notification: notification, data: data });
    });
}
module.exports = { execute, sendNotification };
