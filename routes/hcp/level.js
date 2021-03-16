var router = require('express').Router();

const { authJwt } = require('../../middleware');
const hcpLevel = require('../../controllers/hcp/hcpLevel.js');

router.route('/').all([ authJwt.verifyToken ]).get(hcpLevel.list).post(hcpLevel.insert);
router.route('/:id').all([ authJwt.verifyToken ]).get(hcpLevel.get).put(hcpLevel.update).delete(hcpLevel.remove);

module.exports = router;
