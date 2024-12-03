const socket = io({ autoConnect: false });
let socketConnected = false;
const CHUNK_SIZE = 10 * 1024; // 10KB

const elements = {
	uploadForm: document.getElementById('uploadForm'),
	commentField: document.getElementById('commentField'),
	fileInput: document.getElementById('fileInput'),
	uploadButton: document.getElementById('uploadButton'),
	progressText: document.getElementById('progressText'),
	progressCircle: document.querySelector('.progress-circle'),
	fileList: document.getElementById('fileList'),
};

const circleRadius = 45;
const circumference = 2 * Math.PI * circleRadius;

if (elements.progressCircle) {
	elements.progressCircle.style.strokeDasharray = `${circumference}`;
	elements.progressCircle.style.strokeDashoffset = `${circumference}`;
}

// Event listeners
elements.uploadButton.addEventListener('click', onUploadButtonClick);
elements.fileInput.addEventListener('change', onFileInputChange);

// Socket listeners
socket.on('uploadProgress', onUploadProgress);
socket.on('uploadError', onUploadError);

function onUploadButtonClick(event) {
	event.preventDefault();
	if (!socketConnected) {
		socket.connect();
		elements.uploadButton.disabled = false;
		handleUpload(event);
	}
}

function onFileInputChange(event) {
	event.preventDefault();
	elements.uploadButton.disabled = !elements.fileInput.files.length;
}

function onUploadProgress({ progress }) {
	console.log(`Received progress update: ${progress}%`);
	if (
		progress > 0 &&
		progress <= 100 &&
		elements.progressText.textContent !== `${progress}%`
	) {
		updateProgress(progress);
	}
}

function onUploadError({ message }) {
	showError(`Error: ${message}`);
}

async function handleUpload(event) {
	event.preventDefault();
	const file = elements.fileInput.files[0];
	const comment = elements.commentField.value.trim();

	if (!file || !comment) {
		showError(file ? 'Please specify a comment!' : 'Please select a file!');
		return;
	}

	try {
		socket.emit(
			'fileUploadStart',
			{ fileName: file.name, totalSize: file.size, comment },
			(response) => {
				if (response.status === 'ready') {
					startUploadingChunks();
				} else {
					showError('File upload initialization failed!');
				}
			},
		);
	} catch (error) {
		console.error('File upload initialization failed', error);
		showError('An error occurred during upload initialization!');
	}
}

async function startUploadingChunks() {
	const file = elements.fileInput.files[0];
	let offset = 0;

	try {
		while (offset < file.size) {
			const chunk = file.slice(offset, offset + CHUNK_SIZE);
			const buffer = await chunk.arrayBuffer();
			socket.emit('fileUploadChunk', buffer, (response) => {
				if (response.status === 'success') {
					updateProgress(response.progress);
				} else {
					showError('Error uploading chunk!');
				}
			});
			offset += CHUNK_SIZE;
		}

		socket.emit('fileUploadEnd', (response) => {
			if (response.status === 'finish') {
				showSuccess(response.message);
				resetForm();
				loadFileList();
			} else {
				showError('Error ending file upload!');
			}
		});
	} catch (error) {
		console.error('File upload failed', error);
		showError('An error occurred during file upload.');
	}
}

function updateProgress(progress) {
	elements.progressText.textContent = `${Math.round(progress)}%`;
	elements.progressCircle.style.strokeDashoffset =
		circumference - (progress / 100) * circumference;
}

function resetForm() {
	console.log('Resetting form...');
	elements.progressText.textContent = '👽';
	elements.progressCircle.style.strokeDashoffset = circumference;
	elements.commentField.value = '';
	elements.fileInput.value = '';
	elements.uploadButton.disabled = true;
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
	elements.fileList.innerHTML = '';
	files.forEach(({ fileName, comment }) => {
		const listItem = document.createElement('li');
		listItem.classList.add('file-item');
		listItem.innerHTML = `<a href="/api/v1/files/${fileName}" download>${fileName}</a><span class="comment">Comment: ${comment}</span>`;
		elements.fileList.appendChild(listItem);
	});
}

function showSuccess(message) {
	alert(message);
}

function showError(message) {
	alert(message);
}

window.addEventListener('load', loadFileList);
