const path = require('path');

const getFilePath = (fileName, levelUp = false) => {
	return levelUp
		? path.resolve(__dirname, '..', fileName)
		: path.resolve(__dirname, fileName);
};

module.exports = getFilePath;
