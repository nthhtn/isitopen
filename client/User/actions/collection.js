export function getCollections(){
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

function getCollectionsSuccess(result){
	return {
		type:'GET_COLLECTIONS_SUCCESS',
		result
	};
};

export function createCollection(collection){
	return async (dispatch)=>{
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

export function createCollectionSuccess(result) {
	return { type: 'CREATE_COLLECTION_SUCCESS', result };
};
