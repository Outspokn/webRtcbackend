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
    console.log(socket.user, "Connected");
    socket.join(socket.user);

    socket.on("callUser", (data) => {
      let calleeId = data.userToCall;
      let rtcMessage = data.rtcMessage;

      socket.to(calleeId).emit("newCall", {
        from: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("answerCall", (data) => {
      let callerId = data.userToAnswer;
      let rtcMessage = data.rtcMessage;

      socket.to(callerId).emit("callAnswered", {
        from: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("ICEcandidate", (data) => {
      let calleeId = data.to;
      let candidate = data.candidate;

      socket.to(calleeId).emit("ICEcandidate", {
        from: socket.user,
        candidate: candidate,
      });
    });

    socket.on("callEnd", (data) => {
      let userId = data.to;
      socket.to(userId).emit("callEnd");
    });

    socket.on("disconnect", () => {
      console.log(socket.user, "Disconnected");
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
