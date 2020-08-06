const initialState = {
	list: [],
	page: 1,
	previousPage: 0,
	nextPage: 2,
	lastPage: 1,
	hasMore: true,
	count: 0,
	filter: {},
};

export default function (state = initialState, action) {
	switch (action.type) {
		case 'GET_RESTAURANTS_SUCCESS':
			const { result, hasMore, count, page } = action;
			return {
				...state,
				list: result,
				hasMore,
				count,
				page,
				nextPage: page + 1,
				lastPage: count === 0 ? 1 : Math.ceil(count / 10)
			};
		default: return state;
	}
};
