var router = require('express').Router();

const { authJwt } = require('../../middleware');
const leaveType = require('../../controllers/hcp/leaveType.js');

router.route('/').all([ authJwt.verifyToken ]).get(leaveType.list).post(leaveType.insert);
router.route('/:id').all([ authJwt.verifyToken ]).get(leaveType.get).put(leaveType.update).delete(leaveType.remove);

module.exports = router;
