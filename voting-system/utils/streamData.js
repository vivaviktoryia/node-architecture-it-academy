const fs = require('fs');
const { Readable } = require('stream');
const { getHeaderByFormat } = require('./getHeaders');

function streamFileToResponse(
	res,
	filePath,
	download = true,
	fileName = 'file.txt',
	encoding = 'UTF-8',
) {
	const readStream = fs.createReadStream(filePath);

	res.set({
		'Content-Type': `text/plain; charset=${encoding}`,
		'Content-Disposition': download
			? `attachment; filename="${fileName}"`
			: 'inline',
	});

	readStream.pipe(res);

	readStream.on('error', (err) => {
		console.error('Error reading the file:', err);
		res.status(500).send('Error reading the file.');
	});
}

function streamDataToResponse(res, data, format, fileName) {
	const contentType = getHeaderByFormat(format);

	const stream = Readable.from([data]);

	res.set({
		'Content-Type': contentType,
		'Content-Disposition': `attachment; filename="${fileName}.${format}"`,
	});

	stream.pipe(res);

	stream.on('open', () => {
		console.log(
			`Streaming data to client with format: ${format}, filename: ${fileName}`,
		);
	});

	stream.on('error', (err) => {
		console.error('Error streaming the data:', err);
		res.status(500).send('Error streaming the data🤯');
	});

	res.on('close', () => {
		stream.destroy();
	});
}

module.exports = {
	streamFileToResponse,
	streamDataToResponse,
};
