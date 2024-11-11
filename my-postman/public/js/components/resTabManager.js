export function showTabContent(
	tabName,
	prettyBodyContent,
	rawBodyContent,
	headerContent,
	tabPrettyBody,
	tabRawBody,
	tabHeader,
) {
	if (tabName === 'Pretty Body') {
		prettyBodyContent.style.display = 'block'; 
		rawBodyContent.style.display = 'none'; 
		headerContent.style.display = 'none'; 
		tabPrettyBody.classList.add('active'); 
		tabRawBody.classList.remove('active'); 
		tabHeader.classList.remove('active'); 
	} else if (tabName === 'Raw Body') {
		prettyBodyContent.style.display = 'none';
		rawBodyContent.style.display = 'block'; 
		headerContent.style.display = 'none'; 
		tabPrettyBody.classList.remove('active'); 
		tabRawBody.classList.add('active'); 
		tabHeader.classList.remove('active'); 
	} else if (tabName === 'Headers') {
		headerContent.style.display = 'block';
		prettyBodyContent.style.display = 'none';
		rawBodyContent.style.display = 'none'; 
		tabPrettyBody.classList.remove('active'); 
		tabRawBody.classList.remove('active'); 
		tabHeader.classList.add('active'); 
	}
}
