var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientInitialExpenditure = require('../../controllers/hcp/clientInitialExpenditure.js');

router.route('/').all([ authJwt.verifyToken ]).get(clientInitialExpenditure.list).post(clientInitialExpenditure.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(clientInitialExpenditure.get)
	.put(clientInitialExpenditure.update)
	.delete(clientInitialExpenditure.remove);

module.exports = router;
