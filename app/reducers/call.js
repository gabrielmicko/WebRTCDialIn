var dialInitialState = {
    'number': false,
    'acceptedFrom': false
};

export default function(state = dialInitialState, action) {
    switch (action.type) {
        case 'NUMBER_UPDATE':
            var newState = Object.assign({}, state)
            newState.number = action.number;
            return newState;
            break;
        case 'CALLNUMBER_CLEAR':
            var newState = Object.assign({}, state)
            newState.number = false;
            return newState;
            break;
        case 'ACCEPTED_FROM':
            var newState = Object.assign({}, state)
            newState.acceptedFrom = action.acceptedFrom;
            return newState;
            break;
        default:
            return state;
    }
}
