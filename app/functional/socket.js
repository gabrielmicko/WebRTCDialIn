import SocketIO from 'socket.io-client';
import Store from 'store';
import path from 'path';
import configPath from '../config/config.json';

class SocketConnection {
    constructor() {
        this.address = configPath.dialInServer;
        this.socket = false;
        this.connect();
    }

    connect() {
        this.socket = SocketIO(this.address);
        this.setListeners();
        this.incomingMessages = [];
        this.outgoingMessages = [];
    }

    setListeners() {
        this.socket.on('connection', function() {
            Store.dispatch({
                'type': 'SOCKET',
                'status': 'connected'
            });
            console.log('Socket connected.');
        });

        this.socket.on('disconnect', function() {
            Store.dispatch({
                'type': 'SOCKET',
                'status': 'disconnected'
            });
            console.log('Socket disconnected.');
        });

        this.socket.on('message', function(message) {
            Store.dispatch({
                'type': 'SOCKET_IN_MSG',
                'message': message
            });
        });


        Store.subscribe(function() {
            let currentStore = Store.getState();
            if (currentStore.socketReducer.outgoingMessages.length > this.outgoingMessages.length) {
                let messages = currentStore.socketReducer.outgoingMessages.slice(0);
                let message = messages.pop();
                this.sendMessage(message);
                console.log('Socket send message.');
                this.outgoingMessages = currentStore.socketReducer.outgoingMessages.slice(0);
            }
        }.bind(this));
    }

    sendMessage(message) {
        this.socket.emit('message', message);
    }

}

export default SocketConnection;
