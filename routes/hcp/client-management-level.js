var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientManagementLevel = require('../../controllers/hcp/clientManagementLevel.js');

router.route('/').all([ authJwt.verifyToken ]).get(clientManagementLevel.list).post(clientManagementLevel.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(clientManagementLevel.get)
	.put(clientManagementLevel.update)
	.delete(clientManagementLevel.remove);

module.exports = router;
