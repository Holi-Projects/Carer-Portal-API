var router = require('express').Router();

const { authJwt } = require('../middleware');
const employee = require('../controllers/employee.js');

router.route('/').all([ authJwt.verifyToken ]).get(employee.list).post(employee.insert);
router.route('/:id').all([ authJwt.verifyToken ]).get(employee.get).put(employee.update).delete(employee.remove);

module.exports = router;
