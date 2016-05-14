const socketServerIP = 'localhost:8888';
import SocketIO from 'socket.io-client';
import Store from 'store';

class SocketConnection {
  constructor() {
    this.socket = false;
    this.connect();
  }

  connect() {
    this.socket = SocketIO(socketServerIP);
    this.setListeners();
    this.incomingMessages = [];
    this.outgoingMessages = [];
  }

  setListeners() {
    this.socket.on('connect', function() {
      Store.dispatch({
        'type': 'SOCKET',
        'status': 'connected'
      });
    });

    this.socket.on('disconnect', function() {
      Store.dispatch({
        'type': 'SOCKET',
        'status': 'disconnected'
      });
    });

    this.socket.on('message', function(message) {
      Store.dispatch({
        'type': 'SOCKET_IN_MSG',
        'message': message
      });
    });


    Store.subscribe(function() {
      let currentStore = Store.getState();
      if(currentStore.socketReducer.outgoingMessages.length > this.outgoingMessages.length) {
        let messages = currentStore.socketReducer.outgoingMessages.slice(0);
        let message = messages.pop();
        this.sendMessage(message);
        this.outgoingMessages = currentStore.socketReducer.outgoingMessages.slice(0);
      }
    }.bind(this));
  }

  sendMessage(message) {
    this.socket.emit('message', message);
  }

}

export default SocketConnection;
