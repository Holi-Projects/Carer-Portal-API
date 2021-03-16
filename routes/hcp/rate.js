var router = require('express').Router();

const { authJwt } = require('../../middleware');
const hcpRate = require('../../controllers/hcp/hcpRate.js');

router.route('/').all([ authJwt.verifyToken ]).get(hcpRate.list).post(hcpRate.insert);
router.route('/:id').all([ authJwt.verifyToken ]).get(hcpRate.get).put(hcpRate.update).delete(hcpRate.remove);

module.exports = router;
