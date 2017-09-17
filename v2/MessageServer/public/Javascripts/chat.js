const Chat = function(socket){
	this.socket = socket;
}

Chat.prototype.sendMessage = function(room,text){
	const message = {
		room:room,
		text: text
	};
	this.socket.emit('message',message);
}

Chat.prototype.changeRoom = function(room){
	this.socket.emit('join',{
		newRoom:room
	});
}

Chat.prototype.processCommand = function(command){
	let words = command.split(' ');
	let message;
	command = words[0].substring(1,words[0].length).toLowerCase();

	if(command === 'join'){
		words.shift();
		const room = words.join(' ');
		this.changeRoom(room);
	}else{
		message = 'Unrecognized command';
	}

	return message;
}