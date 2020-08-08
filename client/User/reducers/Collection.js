const initialState = {
	list: [],
	current: null
};

export default function (state = initialState, action) {
	switch (action.type) {
		case 'GET_COLLECTIONS_SUCCESS': return { ...state, list: action.result };
		case 'CREATE_COLLECTION_SUCCESS': return { ...state, list: [...state.list, action.result] };
		default: return state;
	}
};
