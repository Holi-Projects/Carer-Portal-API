var router = require('express').Router();

const { authJwt } = require('../../middleware');
const supplier = require('../../controllers/hcp/supplier.js');

router.route('/').all([ authJwt.verifyToken ]).get(supplier.list).post(supplier.insert);
router.route('/:id').all([ authJwt.verifyToken ]).get(supplier.get).put(supplier.update).delete(supplier.remove);

module.exports = router;
