function getTimestamp() {
	const now = new Date();

	const dateStr = now
		.toLocaleString('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		})
		.replace(',', '')
		.replace('  ', ' ');

	const milliseconds = now.getMilliseconds().toString().padStart(3, '0');

	const timezoneOffset = -now.getTimezoneOffset();
	const sign = timezoneOffset >= 0 ? '+' : '-';
	const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60)
		.toString()
		.padStart(2, '0');
	const timezone = `GMT${sign}${offsetHours}`;

	return `${dateStr}:${milliseconds} ${timezone}`;
}

function logMessage(message, type = 'log', files = []) {
	const timestamp = getTimestamp();

	const logMethods = {
		error: console.error,
		warn: console.warn,
		info: console.info,
		log: console.log,
	};

	const logMethod = logMethods[type] || logMethods.log;
	logMethod(`[${timestamp}]: ${message}`);

	if (files.length > 0) {
		files.forEach((file) => {
			console.log(`    ${file}`);
		});
	}
}

module.exports = {
	logMessage,
};
