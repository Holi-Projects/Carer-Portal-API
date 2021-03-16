var router = require('express').Router();

const { authJwt } = require('../middleware');
const fundingArrangement = require('../controllers/fundingArrangement.js');

router
	.route('/')
	.all([ authJwt.verifyToken ])
	.get(fundingArrangement.getFundingArrangements)
	.post(fundingArrangement.addFundingArrangement);

router
	.route('/:fundingArrangementId')
	.all([ authJwt.verifyToken ])
	.get(fundingArrangement.getFundingArrangement)
	.put(fundingArrangement.updateFundingArrangement)
	.delete(fundingArrangement.deleteFundingArrangement);

module.exports = router;
