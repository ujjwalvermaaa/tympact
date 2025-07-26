// This file will handle Socket.IO connection logic.

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('A user connected via Socket.IO');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
