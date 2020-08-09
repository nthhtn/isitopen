const initialState = {
	list: [],
	current: null
};

export default function (state = initialState, action) {
	switch (action.type) {
		case 'GET_COLLECTIONS_SUCCESS': return { ...state, list: action.result };
		case 'CREATE_COLLECTION_SUCCESS': return { ...state, list: [...state.list, action.result] };
		case 'GET_COLLECTION_DETAILS_SUCCESS': return { ...state, current: action.result };
		case 'REMOVE_FROM_COLLECTION_SUCCESS':
			let restaurants = [...state.current.restaurants];
			restaurants = restaurants.filter((item) => action.list.indexOf(item) === -1);
			return { ...state, current: { ...state.current, restaurants } };
		case 'ADD_TO_COLLECTION_SUCCESS':
			return state;
		default: return state;
	}
};
