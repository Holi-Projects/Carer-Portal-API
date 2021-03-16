var router = require('express').Router();

const { authJwt } = require('../../middleware');
const myob = require('../../controllers/hcp/myob.js');

//router.route('/').all([ authJwt.verifyToken ]).get(hcpLevel.list).post(hcpLevel.insert);
router.route('/').all([ authJwt.verifyToken ]).post(myob.createFile);
//router.route('/:id').all([ authJwt.verifyToken ]).get(hcpLevel.get).put(hcpLevel.update).delete(hcpLevel.remove);

module.exports = router;
