const { getFileList } = require('../services/fileService');

const getOverview = async (req, res, next) => {
	const files = await getFileList();
	res.render('overview', { files });
};

module.exports = {
	getOverview,
};
