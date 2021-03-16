var router = require('express').Router();

const { authJwt } = require('../../middleware');
const financialYear = require('../../controllers/hcp/financialYear.js');

router.route('/').all([ authJwt.verifyToken ]).get(financialYear.list).post(financialYear.insert);
router
	.route('/:id')
	.all([ authJwt.verifyToken ])
	.get(financialYear.get)
	.put(financialYear.update)
	.delete(financialYear.remove);

module.exports = router;
