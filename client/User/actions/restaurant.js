export function getRestaurants({ page = 1, limit = 20, q = '', time = 0, days = '' }) {
	return async (dispatch) => {
		let url = `/api/restaurants?page=${page}&limit=${limit}`;
		if (time) { url += `&time=${time}`; }
		if (q) { url += `&q=${q}`; }
		if (days) { url += `&days=${days}` };
		let response = await fetch(url, { credentials: 'same-origin' });
		let responseJson = await response.json();
		if (responseJson.success) {
			const { result, hasMore, count } = responseJson;
			dispatch(getRestaurantsSuccess(result, hasMore, count, page));
		}
	};
};

function getRestaurantsSuccess(result, hasMore, count, page) {
	return {
		type: 'GET_RESTAURANTS_SUCCESS',
		result,
		hasMore,
		count,
		page
	};
};
