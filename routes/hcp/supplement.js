var router = require('express').Router();

const { authJwt } = require('../../middleware');
const supplement = require('../../controllers/hcp/supplement.js');

router.route('/').all([ authJwt.verifyToken ]).get(supplement.list).post(supplement.insert);
router.route('/:id').all([ authJwt.verifyToken ]).get(supplement.get).put(supplement.update).delete(supplement.remove);

module.exports = router;
