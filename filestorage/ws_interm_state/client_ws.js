const socket = io({ autoConnect: false });
let socketConnected = false;
const CHUNK_SIZE = 10 * 1024; // 10KB

const uploadForm = document.getElementById('uploadForm');
const commentField = document.getElementById('commentField');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const progressText = document.getElementById('progressText');
const progressCircle = document.querySelector('.progress-circle');
const fileList = document.getElementById('fileList');

const circleRadius = 45;
const circumference = 2 * Math.PI * circleRadius;

if (progressCircle) {
	progressCircle.style.strokeDasharray = `${circumference}`;
	progressCircle.style.strokeDashoffset = `${circumference}`;
}

uploadButton.addEventListener('click', async (event) => {
	event.preventDefault();
	if (!socketConnected) {
		socket.connect();
		uploadButton.disabled = false;
		await handleUpload(event);
	}

	// socket.on('connect', async () => {
	// 	console.log('Socket connected');
	// 	// socketConnected = true;
	// 	uploadButton.disabled = false;
	// 	await handleUpload(event);
	// });
});

// socket.on('disconnect', () => {
// 	console.log('Socket disconnected');
// 	socketConnected = false;
// });

// socket.on('uploadStart', ({ fileName, totalSize, message }) => {
// 	console.log(message);
// 	startUploadingChunks(fileName, totalSize);
// });
socket.on('uploadProgress', ({ progress }) => {
	console.log(`Received progress update: ${progress}%`);
	if (progress > 0 && progress <= 100) {
		if (progressText.textContent !== `${progress}%`) updateProgress(progress);
	}
});

// socket.on('uploadComplete', ({ message }) => {
// 	console.log('Upload complete:', message);
// 	showSuccess(message);
// 	resetForm();
// 	socketConnected = false;

// 	loadFileList();
// });

socket.on('uploadError', ({ message }) => showError(`Error: ${message}`));

fileInput.addEventListener('change', (event) => {
	event.preventDefault();
	console.log(`Files selected: ${fileInput.files.length}`);
	uploadButton.disabled = !fileInput.files.length;
});

async function handleUpload(event) {
	event.preventDefault();
	const file = fileInput.files[0];
	const comment = commentField.value.trim();

	if (!file) {
		showError('Please select a file!');
		return;
	}
	if (!comment) {
		showError('Please specify a comment!');
		return;
	}

	try {
		socket.emit(
			'fileUploadStart',
			{
				fileName: file.name,
				totalSize: file.size,
				comment,
			},
			(response) => {
				if (response.status === 'ready') {
					// showSuccess('!!!!!!RESPONSE!!!!!!!!!')
					startUploadingChunks();
				} else {
					showError('ERROR!!!!!!!!fileUploadStart!!!!!!!!!!');
				}
			},
		);
	} catch (error) {
		console.error('File upload initialization failed', error);
		showError('An error occurred during upload initialization!');
	}
}

async function startUploadingChunks() {
	const file = fileInput.files[0];
	let offset = 0;

	try {
		while (offset < file.size) {
			console.log('offset:', offset);
			console.log('file.size', file.size);
			const chunk = file.slice(offset, offset + CHUNK_SIZE);
			const buffer = await chunk.arrayBuffer();
			socket.emit('fileUploadChunk', buffer, (response) => {
				if (response.status === 'success') {
					updateProgress(response.progress);
					// showSuccess(`!!!!!!RESPONSE!!!!!!!!! ${response.progress}`);
				} else {
					showError('ERROR!!!!!!!!startUploadingChunks!!!!!!!!!!');
				}
			});
			offset += CHUNK_SIZE;
		}
		socket.emit('fileUploadEnd', (response) => {
			if (response.status === 'finish') {
				// showSuccess(`!!!!!!RESPONSE!!!!!!!!! ${response.status}`);
				showSuccess(response.message);
				resetForm();
				// socketConnected = false;

				loadFileList();
			} else {
				showError('ERROR!!!!!!!fileUploadEnd!!!!!!!!!!!');
			}
		});
	} catch (error) {
		console.error('File upload failed', error);
		showError('An error occurred during file upload.');
	}
}

function updateProgress(progress) {
	progressText.textContent = `${Math.round(progress)}%`;
	progressCircle.style.strokeDashoffset =
		circumference - (progress / 100) * circumference;
}

function resetForm() {
	console.log('Resetting form...');
	progressText.textContent = '👽';
	progressCircle.style.strokeDashoffset = circumference;
	commentField.value = '';
	fileInput.value = '';
	uploadButton.disabled = true;
	socketConnected = false;
}

async function loadFileList() {
	try {
		const response = await fetch('/api/v1/files');
		const data = await response.json();
		renderFileList(data.data);
	} catch (error) {
		console.error('Failed to load file list', error);
	}
}

function renderFileList(files) {
	fileList.innerHTML = '';
	files.forEach(({ fileName, comment }) => {
		const listItem = document.createElement('li');
		listItem.classList.add('file-item');
		listItem.innerHTML = `<a href="/api/v1/files/${fileName}" download>${fileName}</a><span class="comment">Comment: ${comment}</span>`;
		fileList.appendChild(listItem);
	});
}

window.addEventListener('load', loadFileList);

function showSuccess(message) {
	alert(message);
}

function showError(message) {
	alert(message);
}
