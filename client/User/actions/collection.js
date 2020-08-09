export function getCollections() {
	return async (dispatch) => {
		let url = `/api/collections`;
		let response = await fetch(url, { credentials: 'same-origin' });
		let responseJson = await response.json();
		if (responseJson.success) {
			const { result } = responseJson;
			dispatch(getCollectionsSuccess(result));
		}
	};
};

function getCollectionsSuccess(result) {
	return {
		type: 'GET_COLLECTIONS_SUCCESS',
		result
	};
};

export function createCollection(collection) {
	return async (dispatch) => {
		const response = await fetch(`/api/collections`, {
			credentials: 'same-origin',
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(collection)
		});
		const responseJson = await response.json();
		dispatch(createCollectionSuccess(responseJson.result));
	};
};

function createCollectionSuccess(result) {
	return { type: 'CREATE_COLLECTION_SUCCESS', result };
};

export function getCollectionDetails(id) {
	return async (dispatch) => {
		let response = await fetch(`/api/collections/${id}`, { credentials: 'same-origin' });
		let responseJson = await response.json();
		if (responseJson.success) {
			const { result } = responseJson;
			response = await fetch(`/api/collections/${id}/restaurants`, { credentials: 'same-origin' });
			responseJson = await response.json();
			result.restaurants = responseJson.result;
			dispatch(getCollectionDetailsSuccess(result));
		}
	};
};

function getCollectionDetailsSuccess(result) {
	return { type: 'GET_COLLECTION_DETAILS_SUCCESS', result };
};

export function removeFromCollection(collectionId, restaurantIds) {
	return async (dispatch) => {
		let response = await fetch(`/api/collections/${collectionId}/restaurants`, {
			credentials: 'same-origin',
			method: 'delete',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ list: restaurantIds })
		});
		let responseJson = await response.json();
		if (responseJson.success) {
			dispatch(removeFromCollectionSuccess(restaurantIds));
		}
	};
};

function removeFromCollectionSuccess(list) {
	return { type: 'REMOVE_FROM_COLLECTION_SUCCESS', list };
};

export function addToCollection(collectionId, restaurantIds) {
	return async (dispatch) => {
		let response = await fetch(`/api/collections/${collectionId}/restaurants`, {
			credentials: 'same-origin',
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ list: restaurantIds })
		});
		let responseJson = await response.json();
		if (responseJson.success) {
			dispatch(addToCollectionSuccess(restaurantIds));
		}
	};
};

function addToCollectionSuccess(list) {
	return { type: 'ADD_TO_COLLECTION_SUCCESS', list };
};
