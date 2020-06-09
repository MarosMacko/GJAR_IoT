export const updateObject = (state, updateItem) => {
	return {
		...state,
		...updateItem
	};
};
