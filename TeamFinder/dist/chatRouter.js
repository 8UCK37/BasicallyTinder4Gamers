var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Storage } = require('@google-cloud/storage');
const bucketName = 'gs://teamfinder-e7048.appspot.com/';
const { v4: uuidv4 } = require('uuid');
const socketRunner = require('./socketRunner');
function upChatBackGround(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.file);
        if (req.file) {
            const destFileName = 'ChatBackground/' + req.user.user_id + '.jpg';
            //console.log(myUUID);
            const storage = new Storage();
            function uploadFromMemory() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield storage.bucket(bucketName).file(destFileName).save(req.file.buffer);
                    console.log(`${destFileName}  uploaded to ${bucketName}.`);
                });
            }
            uploadFromMemory().catch(console.error);
        }
    });
}
function uploadChatImage(req, res, prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.file);
        let body = JSON.parse(req.body.data);
        const io = req.app.get('socketIo');
        //console.log('incoming chat',body);
        if (req.file) {
            const storage = new Storage();
            const newUUID = uuidv4();
            const destFileName = 'ChatImages/' + newUUID + '.jpg';
            function uploadFromMemory() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield storage.bucket(bucketName).file(destFileName).save(req.file.buffer);
                    console.log(`${destFileName}  uploaded to ${bucketName}.`);
                    const photoUrl = `https://firebasestorage.googleapis.com/v0/b/teamfinder-e7048.appspot.com/o/ChatImages%2F${newUUID}.jpg?alt=media&token=13a7d5b5-e441-4a5f-8204-60aff096a1bf`;
                    chatData = yield prisma.Chat.create({
                        data: {
                            sender: body.data.sender,
                            receiver: body.data.receiver,
                            msg: body.data.msg,
                            photoUrl: photoUrl
                        }
                    });
                    console.log("here");
                    socketRunner.sendNotification(io, "imageUploadDone", body.data.sender, body.data.receiver, photoUrl);
                });
            }
            uploadFromMemory().catch(console.error);
        }
        else {
            //console.log('chat without images')
            chatData = yield prisma.Chat.create({
                data: {
                    sender: body.data.sender,
                    receiver: body.data.receiver,
                    msg: body.data.msg
                }
            });
        }
    });
}
module.exports = { upChatBackGround, uploadChatImage };
