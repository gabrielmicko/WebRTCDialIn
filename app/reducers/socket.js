var socketState = {
    'status': [],
    'outgoingMessages': [],
    'incomingMessages': []
};

export default function(state = socketState, action) {
    switch(action.type) {
        case 'SOCKET':
            var newState = Object.assign({}, state)
            newState.status.push(action.status);
            return newState;

        case 'SOCKET_IN_MSG':
          var newState = Object.assign({}, state)
          newState.incomingMessages.push(action.message);
          return newState;

        case 'SOCKET_OUT_MSG':
            var newState = Object.assign({}, state)
            newState.outgoingMessages.push(action.message);
            return newState;
        default:
            return state;
    }
}
