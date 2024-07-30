const removeLocalStorageItems = (...items: string[]) => {
	items.forEach((item) => {
		localStorage.removeItem(item);
	});
};

export default removeLocalStorageItems;
