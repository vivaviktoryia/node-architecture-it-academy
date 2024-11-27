const getOverview = async (req, res, next) => {
	
	res.render('overview');
};

module.exports = {
	getOverview,
};
