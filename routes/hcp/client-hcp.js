var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientHcp = require('../../controllers/hcp/clientHcp.js');

router.route('/').all([ authJwt.verifyToken ]).get(clientHcp.list).post(clientHcp.insert);
router.route('/:id').all([ authJwt.verifyToken ]).get(clientHcp.get).put(clientHcp.update).delete(clientHcp.remove);

module.exports = router;
