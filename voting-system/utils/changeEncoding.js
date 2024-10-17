function changeEncoding(
	response,
	fromEncoding = 'windows-1251',
	toEncoding = 'utf-8',
) {
	const transformedBody = response.body
		.pipeThrough(new TextDecoderStream(fromEncoding))
		.pipeThrough(new TextEncoderStream(toEncoding));
	return new Response(transformedBody);
}


module.exports = {
	changeEncoding,
};
