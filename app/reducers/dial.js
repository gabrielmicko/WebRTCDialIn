var dialInitialState = {
    'callNumber': []
};

export default function(state = dialInitialState, action) {
    switch (action.type) {
        case 'CALLNUMBER_UPDATE':
            var newState = Object.assign({}, state)
            newState.callNumber.push(action.number);
            return newState;
        case 'CALLNUMBER_CLEAR':
            var newState = Object.assign({}, state)
            newState.callNumber = [];
            return newState;
        default:
            return state;
    }
}
