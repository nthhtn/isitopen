const initialState = {
	list: [],
	page: 1,
	hasMore: true,
	count: 0
};

export default function (state = initialState, action) {
	switch (action.type) {
		case 'GET_RESTAURANTS_SUCCESS':
			const { result, hasMore, count, page } = action;
			return {
				list: result,
				hasMore,
				count,
				page
			};
		default: return state;
	}
};
