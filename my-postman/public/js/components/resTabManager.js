export function showTabContent(
	tabName,
	bodyContent,
	headerContent,
	tabBody,
	tabHeader,
) {
	if (tabName === 'Body') {
		bodyContent.style.display = 'block';
		headerContent.style.display = 'none';
		tabBody.classList.add('active');
		tabHeader.classList.remove('active');
	} else {
		bodyContent.style.display = 'none';
		headerContent.style.display = 'block';
		tabHeader.classList.add('active');
		tabBody.classList.remove('active');
	}
}
