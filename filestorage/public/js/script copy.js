const socket = io();

const uploadForm = document.getElementById('uploadForm');
const commentField = document.getElementById('commentField');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');

const progressText = document.getElementById('progressText');
const progressCircle = document.querySelector('.progress-circle');
const circleRadius = 45;
const circumference = 2 * Math.PI * circleRadius;

if (progressCircle) {
	progressCircle.style.strokeDasharray = `${circumference}`;
	progressCircle.style.strokeDashoffset = `${circumference}`;
}

// uploadForm.addEventListener('submit', (event) => {
// 	event.preventDefault();

// 	const formData = new FormData(uploadForm);
// 	const xhr = new XMLHttpRequest();

// 	xhr.open('POST', '/api/v1/files', true);

// 	xhr.upload.addEventListener('progress', (event) => {
// 		if (event.lengthComputable) {
// 			const progress = (event.loaded / event.total) * 100;
// 			updateProgress(progress);
// 			socket.emit('uploadProgress', { progress });
// 		}
// 	});

// 	xhr.onload = () => {
// 		if (xhr.status === 201) {
// 			showSuccess('File uploaded successfully!');
// 			loadFileList();
// 			resetForm();
// 			socket.emit('uploadComplete', { message: 'Upload complete' });
// 		} else {
// 			showError('Error uploading file.');
// 			socket.emit('uploadError', { message: 'Upload failed' });
// 		}
// 	};

// 	xhr.send(formData);
// });

uploadButton.addEventListener('click', async () => {
	const file = fileInput.files[0];
	const comment = commentInput.value.trim();

	if (!file) {
		alert('Please select a file');
		return;
	}

	const CHUNK_SIZE = 64 * 1024; // 64KB
	let offset = 0;

	socket.emit('fileUploadStart', {
		fileName: file.name,
		totalSize: file.size,
		comment,
	});

	while (offset < file.size) {
		const chunk = file.slice(offset, offset + CHUNK_SIZE);
		const buffer = await chunk.arrayBuffer();
		socket.emit('fileUploadChunk', buffer);
		offset += CHUNK_SIZE;
	}

	socket.emit('fileUploadEnd');
});

socket.on('uploadProgress', (data) => {
	// progressFill.style.width = `${data.progress}%`;
	updateProgress(data.progress);
});

socket.on('uploadComplete', (data) => {
	showSuccess(data.message);
	// progressFill.style.width = '0';
	resetForm();
	loadFileList();
});

socket.on('uploadError', (data) => {
	showError(`Error: ${data.message}`);
});

function updateProgress(progress) {
	progressText.textContent = `${Math.round(progress)}%`;
	const offset = circumference - (progress / 100) * circumference;
	progressCircle.style.strokeDashoffset = offset;
}

function resetForm() {
	progressText.textContent = '👽';
	progressCircle.style.strokeDashoffset = circumference;
	commentField.value = '';
	fileInput.value = '';
}

function loadFileList() {
	fetch('/api/v1/files')
		.then((response) => response.json())
		.then((data) => {
			const fileList = document.getElementById('fileList');
			fileList.innerHTML = '';

			data.data.forEach((file) => {
				const listItem = document.createElement('li');
				listItem.classList.add('file-item');
				listItem.innerHTML = `
          <a href="/api/v1/files/${file.filename}" download>${file.filename}</a>
          <span class="comment">Comment: ${file.comment}</span>
        `;
				fileList.appendChild(listItem);
			});
		})
		.catch((error) => console.error('Failed to load file list', error));
}

function showSuccess(message) {
	alert(message);
}

function showError(message) {
	alert(message);
}

window.onload = loadFileList;
