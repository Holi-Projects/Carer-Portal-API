var router = require('express').Router();

const { authJwt } = require('../middleware');
const contactHistory = require('../controllers/contactHistory.js');

//router.route('/').get([ authJwt.verifyToken ], contactHistory.getContactHistory); // supports query parameters clientId, carerId, employeeId and AgencyId
router.route('/').all([ authJwt.verifyToken ]).get(contactHistory.list).post(contactHistory.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(contactHistory.get)
	.put(contactHistory.update)
	.delete(contactHistory.remove);

module.exports = router;
