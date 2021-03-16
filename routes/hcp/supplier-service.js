var router = require('express').Router();

const { authJwt } = require('../../middleware');
const supplierService = require('../../controllers/hcp/supplierService.js');

router.route('/').all([ authJwt.verifyToken ]).get(supplierService.list).post(supplierService.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(supplierService.get)
	.put(supplierService.update)
	.delete(supplierService.remove);

module.exports = router;
