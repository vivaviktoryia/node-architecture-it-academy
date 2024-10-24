document.addEventListener('DOMContentLoaded', function () {
	// Adding headers
	const headersContainer = document.getElementById('headers-container');
	const addHeaderBtn = document.getElementById('add-header-btn');

	addHeaderBtn.addEventListener('click', function () {
		const div = document.createElement('div');
		div.classList.add('header-row');
		div.innerHTML = `
            <input type="text" name="headerKey[]" placeholder="Header Key" required />
            <input type="text" name="headerValue[]" placeholder="Header Value" required />
            <button type="button" class="remove-header-btn">Remove</button>
        `;
		headersContainer.insertBefore(div, addHeaderBtn);

		// Remove button logic
		div
			.querySelector('.remove-header-btn')
			.addEventListener('click', function () {
				div.remove();
			});
	});

	// Adding query parameters
	const queryParamsContainer = document.getElementById(
		'query-params-container',
	);
	const addQueryParamBtn = document.getElementById('add-query-param-btn');

	addQueryParamBtn.addEventListener('click', function () {
		const div = document.createElement('div');
		div.classList.add('query-param-row');
		div.innerHTML = `
            <input type="text" name="queryKey[]" placeholder="Query Key" required />
            <input type="text" name="queryValue[]" placeholder="Query Value" required />
            <button type="button" class="remove-query-param-btn">Remove</button>
        `;
		queryParamsContainer.insertBefore(div, addQueryParamBtn);

		// Remove button logic
		div
			.querySelector('.remove-query-param-btn')
			.addEventListener('click', function () {
				div.remove();
			});
	});
});
