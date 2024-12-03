document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('#sql-form');
	const queryInput = document.querySelector('#query');
	const resultContainer = document.querySelector('#result');
	const errorContainer = document.querySelector('#error');
	const databaseInfo = document.querySelector('#current-database');
	const loadingIndicator = document.createElement('div');

	loadingIndicator.classList.add('loading');
	loadingIndicator.textContent = 'Processing...';

	form.addEventListener('submit', handleFormSubmit);

	queryInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleFormSubmit(e);
		}
	});

	async function handleFormSubmit(e) {
		e.preventDefault();

		resetUI();

		const query = queryInput.value.trim();
		if (!query) {
			showError('Enter SQL query!');
			return;
		}

		showLoading();

		try {
			const response = await fetch('/api/v1/query', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query }),
			});
			const data = await response.json();

			if (!data.success) {
				throw new Error(data.error || 'Unknown error occurred.');
			}

			hideLoading();
			renderResult(data);

			if (data.type === 'use_database') {
				updateCurrentDatabase(data.database);
			}
		} catch (err) {
			hideLoading();
			showError(`Error: ${err.message}`);
		}
	}

	
	function resetUI() {
		resultContainer.innerHTML = '';
		errorContainer.textContent = '';
	}

	function showLoading() {
		resultContainer.appendChild(loadingIndicator);
	}

	function hideLoading() {
		loadingIndicator.remove();
	}

	function renderResult(data) {
		if (data.type === 'select') {
			renderTable(data.data);
		} else if (data.type === 'update') {
			resultContainer.textContent = `Rows affected: ${data.affectedRows}`;
		} else if (data.type === 'show_databases' || data.type === 'show_tables') {
			renderTable(data.data);
		} else if (data.type === 'use_database') {
			resultContainer.textContent = `Using database: ${data.database}`;
		} else {
			resultContainer.textContent = 'Query executed successfully.';
		}
	}

	function renderTable(rows) {
		if (!rows.length) {
			resultContainer.textContent = 'Query returned no results.';
			return;
		}

		const table = document.createElement('table');
		table.classList.add('result-table');

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
				td.textContent = value ?? 'NULL';
				tr.appendChild(td);
			});
			tbody.appendChild(tr);
		});
		table.appendChild(tbody);

		resultContainer.appendChild(table);
	}

	function showError(message) {
		errorContainer.textContent = message;
	}

	function updateCurrentDatabase(database) {
		databaseInfo.textContent = `Current Database: ${database || 'None'}`;
	}
});
