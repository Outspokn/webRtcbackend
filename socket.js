const { Server } = require("socket.io");
let IO;



module.exports.initIO = (httpServer) => {
  IO = new Server(httpServer);

  IO.use((socket, next) => {
    if (socket.handshake.query) {
      let callerId = socket.handshake.query.callerId;
      socket.user = callerId;
      next();
    }
  });

  IO.on("connection", (socket) => {
    console.log(`${socket.user} Connected`);

    socket.join(socket.user);

    socket.on("callUser", (data) => {
      let calleeId = data.userToCall;
      let rtcMessage = data.rtcMessage;

      console.log(`callUser from ${socket.user} to ${calleeId}`, rtcMessage);

      socket.to(calleeId).emit("newCall", {
        from: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("answerCall", (data) => {
      let callerId = data.userToAnswer;
      let rtcMessage = data.rtcMessage;

      console.log(`answerCall from ${socket.user} to ${callerId}`, rtcMessage);

      socket.to(callerId).emit("callAnswered", {
        from: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("ICEcandidate", (data) => {
      let calleeId = data.to;
      let candidate = data.candidate;

      console.log(`ICEcandidate from ${socket.user} to ${calleeId}`, candidate);

      socket.to(calleeId).emit("ICEcandidate", {
        from: socket.user,
        candidate: candidate,
      });
    });

    socket.on("callEnd", (data) => {
      let userId = data.to;

      console.log(`callEnd from ${socket.user} to ${userId}`);

      socket.to(userId).emit("callEnd");
    });

    socket.on("exchangePublicKey", (data) => {
      let userId = data.to;
      let publicKey = data.publicKey;

      console.log(`exchangePublicKey from ${socket.user} to ${userId}`);

      socket.to(userId).emit("exchangePublicKey", {
        from: socket.user,
        publicKey: publicKey,
      });
    });

    socket.on("exchangeSecretKey", (data) => {
      let userId = data.to;
      let secretKey = data.secretKey;

      console.log(`exchangeSecretKey from ${socket.user} to ${userId}`);

      socket.to(userId).emit("exchangeSecretKey", {
        from: socket.user,
        secretKey: secretKey,
      });
    });

    socket.on("disconnect", () => {
      console.log(`${socket.user} Disconnected`);
    });
  });
};

module.exports.getIO = () => {
  if (!IO) {
    throw new Error("IO not initialized.");
  } else {
    return IO;
  }
};
