// ADD QUERY PARAMS
export function addQueryParam(paramsContainer, key = '', value = '') {
	const paramDiv = document.createElement('div');
	paramDiv.innerHTML = `
            <input type="text" name="queryParams[key]" placeholder="Key" required value="${key}">
            <input type="text" name="queryParams[value]" placeholder="Value" required value="${value}">
             <button type="button" class="remove-param">Remove</button>
        `;
	paramDiv.querySelector('.remove-param').addEventListener('click', () => {
		paramDiv.remove();
	});
	paramsContainer.appendChild(paramDiv);
}

export function getQueryParams(url) {
	const urlObj = new URL(url);
	const params = Array.from(urlObj.searchParams.entries()).map(
		([key, value]) => ({
			key: key,
			value: value,
		}),
	);
	return params;
}
