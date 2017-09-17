const socketio = require('socket.io');
let io;
let guest_number = 1;
let nick_names = {};
let names_used = [];
let current_room = {};

exports.listen = function(server) {
  io = socketio.listen(server);
  io.set('log level', 1);
  io.sockets.on('connection', function (socket) {
    guest_number = assignGuestName(socket, guest_number, nick_names, names_used);
    joinRoom(socket, 'ROOM');
    handleMessageBroadcasting(socket, nick_names);
    handleNameChangeAttempts(socket, nick_names, names_used);
    handleRoomJoining(socket);
    socket.on('rooms', function() {
      socket.emit('rooms', io.sockets.manager.rooms);
    });
    handleClientDisconnection(socket, nick_names, names_used);
  });
};

function assignGuestName(socket, guest_number, nick_names, names_used) {
  const name = 'Guest ' + guest_number;
  nick_names[socket.id] = name;
  socket.emit('nameResult', {
    success: true,
    name: name
  });
  names_used.push(name);
  return guest_number + 1;
}

function joinRoom(socket, room) {
  socket.join(room);
  current_room[socket.id] = room;
  socket.emit('joinResult', {room: room});
  socket.broadcast.to(room).emit('message', {
    text: nick_names[socket.id] + ' has joined ' + room + '.'
  });

  const users_in_room = io.sockets.clients(room);
  if (users_in_room.length > 1) {
    var usersInRoomSummary = 'Users currently in ' + room + ': ';
    for (var index in users_in_room) {
      var userSocketId = users_in_room[index].id;
      if (userSocketId != socket.id) {
        if (index > 0) {
          usersInRoomSummary += ', ';
        }
        usersInRoomSummary += nick_names[userSocketId];
      }
    }
    usersInRoomSummary += '.';
    socket.emit('message', {text: usersInRoomSummary});
  }
}

function handleNameChangeAttempts(socket, nick_names, names_used) {
  socket.on('nameAttempt', function(name) {
    if (name.indexOf('Guest') == 0) {
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin with "Guest".'
      });
    } else {
      if (names_used.indexOf(name) == -1) {
        const previous_name = nick_names[socket.id];
        const previous_name_index = names_used.indexOf(previous_name);
        names_used.push(name);
        nick_names[socket.id] = name;
        delete names_used[previous_name_index];
        socket.emit('nameResult', {
          success: true,
          name: name
        });
        socket.broadcast.to(current_room[socket.id]).emit('message', {
          text: previous_name + ' is now known as ' + name + '.'
        });
      } else {
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use.'
        });
      }
    }
  });
}

function handleMessageBroadcasting(socket) {
  socket.on('message', function (message) {
    socket.broadcast.to(message.room).emit('message', {
      text: nick_names[socket.id] + ': ' + message.text
    });
  });
}

function handleRoomJoining(socket) {
  socket.on('join', function(room) {
    socket.leave(current_room[socket.id]);
    joinRoom(socket, room.newRoom);
  });
}

function handleClientDisconnection(socket) {
  socket.on('disconnect', function() {
    const nameIndex = names_used.indexOf(nick_names[socket.id]);
    delete names_used[nameIndex];
    delete nick_names[socket.id];
  });
}
