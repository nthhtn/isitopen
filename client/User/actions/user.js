export function getMyProfile() {
	return async (dispatch) => {
		const response = await fetch(`/api/users/me`, { credentials: 'same-origin' });
		const responseJson = await response.json();
		dispatch(getMyProfileSuccess(responseJson.result));
	};
};

export function getMyProfileSuccess(result) {
	return { type: 'GET_MY_PROFILE', result };
};
