const initialState = {
	me: null
};

export default function (state = initialState, action) {
	switch (action.type) {
		case 'GET_MY_PROFILE': return { ...state, me: action.result };
		default: return state;
	}
};
