require('dotenv').config();

module.exports = {
	secret : process.env.SECRET_KEY || 'sequel-secret-key',
};
