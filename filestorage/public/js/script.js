const socket = io();

const uploadForm = document.getElementById('uploadForm');
const commentField = document.getElementById('commentField');
const fileInput = document.getElementById('fileInput');
const progressText = document.getElementById('progressText');
const progressCircle = document.querySelector('.progress-circle');

const circleRadius = 45;
const circumference = 2 * Math.PI * circleRadius;

if (progressCircle) {
	progressCircle.style.strokeDasharray = `${circumference}`;
	progressCircle.style.strokeDashoffset = `${circumference}`;
}

uploadForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const formData = new FormData(uploadForm);
	const xhr = new XMLHttpRequest();

	xhr.open('POST', '/api/v1/files', true);

	xhr.upload.addEventListener('progress', (event) => {
		if (event.lengthComputable) {
			const progress = (event.loaded / event.total) * 100;
			updateProgress(progress);
			socket.emit('uploadProgress', { progress });
		}
	});

	xhr.onload = () => {
		if (xhr.status === 201) {
			showSuccess('File uploaded successfully!');
			loadFileList();
			resetForm();
			socket.emit('uploadComplete', { message: 'Upload complete' });
		} else {
			showError('Error uploading file.');
			socket.emit('uploadError', { message: 'Upload failed' });
		}
	};

	xhr.send(formData);
});

function updateProgress(progress) {
	progressText.textContent = `${Math.round(progress)}%`;
	const offset = circumference - (progress / 100) * circumference;
	progressCircle.style.strokeDashoffset = offset;
}

function resetForm() {
	progressText.textContent = '0%';
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
