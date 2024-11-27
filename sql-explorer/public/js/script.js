document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('#sql-form');
	const queryInput = document.querySelector('#query');
	const resultContainer = document.querySelector('#result');
	const errorContainer = document.querySelector('#error');

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		resultContainer.innerHTML = '';
		errorContainer.textContent = '';

		const query = queryInput.value.trim();

		if (!query) {
			errorContainer.textContent = 'Enter SQL query!';
			return;
		}
		try {
			const response = await fetch('/api/v1/query', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query }),
			});
			const data = await response.json();
			if (!data.success) {
				throw new Error(data.error);
			}

			if (data.type === 'select') {
				renderTable(data.data);
			} else if (data.type === 'update') {
				resultContainer.textContent = `Rows affected: ${data.affectedRows}`;
			}
		} catch (err) {
			errorContainer.textContent = `Error: ${err.message}`;
		}
	});

	function renderTable(rows) {
		if (!rows.length) {
			resultContainer.textContent = 'Query returned no results.';
			return;
		}

		const table = document.createElement('table');
		table.border = '1';

		const thead = document.createElement('thead');
		const headerRow = document.createElement('tr');
		Object.keys(rows[0]).forEach((key) => {
			const th = document.createElement('th');
			th.textContent = key;
			headerRow.appendChild(th);
		});
		thead.appendChild(headerRow);
		table.appendChild(thead);

		const tbody = document.createElement('tbody');
		rows.forEach((row) => {
			const tr = document.createElement('tr');
			Object.values(row).forEach((value) => {
				const td = document.createElement('td');
				td.textContent = value;
				tr.appendChild(td);
			});
			tbody.appendChild(tr);
		});
		table.appendChild(tbody);

		resultContainer.appendChild(table);
	}
});
