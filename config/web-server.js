require('dotenv').config();

module.exports = {
	port : process.env.HTTP_PORT || 8000,
};
