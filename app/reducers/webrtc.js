var webrtcInitialState = {
    'cam': true,
    'mic': true,
    'myVideoBlob': false,
    'yourVideoBlob': false,
    'showOnCall': null,
    'candidates': []
};

global.myPc = false;

export default function(state = webrtcInitialState, action) {
    switch (action.type) {
        case 'SET_MY_VID':
            var newState = Object.assign({}, state)
            newState.myVideoBlob = action.video;
            return newState;
            break;
        case 'SET_YOUR_VID':
            var newState = Object.assign({}, state)
            newState.yourVideoBlob = action.video;
            return newState;
            break;

        case 'SHOW_ON_CALL':
            var newState = Object.assign({}, state)
            newState.showOnCall = action.showOnCall;
            return newState;
            break;

        case 'ADD_CANDIDATE':
            var newState = Object.assign({}, state)
            newState.candidates.push(action.candidate);
            return newState;
            break;

        default:
            return state;
    }
}
