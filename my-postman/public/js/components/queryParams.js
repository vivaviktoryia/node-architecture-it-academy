// ADD QUERY PARAMS
export function addQueryParam(paramsContainer) {
	const paramDiv = document.createElement('div');
	paramDiv.innerHTML = `
            <input type="text" name="queryParams[key]" placeholder="Key" required>
            <input type="text" name="queryParams[value]" placeholder="Value" required>
            <button type="button" onclick="this.parentNode.remove()">Remove</button>
        `;
	paramsContainer.appendChild(paramDiv);
}
