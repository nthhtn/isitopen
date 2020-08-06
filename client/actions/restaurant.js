import axios from 'axios';

export function getRestaurants({ page = 1, limit = 10 }) {
	return async (dispatch) => {
		let response = await fetch(`/api/restaurants?page=${page}&limit=${limit}`, { credentials: 'same-origin' });
		let responseJson = await response.json();
		if (responseJson.success) {
			const { result, hasMore, count } = responseJson;
			dispatch(getRestaurantsSuccess(result, hasMore, count, page));
		}
	}
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
