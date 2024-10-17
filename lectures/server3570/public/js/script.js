document.addEventListener('DOMContentLoaded', () => {
	const btnService1 = document.getElementById('btnService1');
	const btnService2 = document.getElementById('btnService2');
	const btnService3 = document.getElementById('btnService3');
	const responseDisplay = document.getElementById('responseDisplay');

	if (btnService1) {
		btnService1.addEventListener('click', () => fetchService('/service1'));
	}

	if (btnService2) {
		btnService2.addEventListener('click', () => fetchService('/service2'));
	}

	if (btnService3) {
		btnService3.addEventListener('click', () => fetchService('/service3', true));
	}
});

const fetchService = async (serviceUrl, needToEncod = false) => {
	try {
        const response = await fetch(serviceUrl);
        const finalResponse = needToEncod
					? await transformWindows1251ToUTF8(response)
					: response;
		const data = await finalResponse.text();
		responseDisplay.innerText = data;
		console.log(data);
	} catch (error) {
		console.error(`Error fetching data from ${serviceUrl}:`, error);
		responseDisplay.innerText = `Failed to fetch data from ${serviceUrl}`;
	}
};

const transformWindows1251ToUTF8 = async (response) => {
	const transformedBody = await response.body
		.pipeThrough(new TextDecoderStream('windows-1251'))
		.pipeThrough(new TextEncoderStream('utf-8'));
	return new Response(transformedBody);
};
