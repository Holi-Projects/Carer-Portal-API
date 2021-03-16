var router = require('express').Router();

const { authJwt } = require('../../middleware');
const clientBudget = require('../../controllers/hcp/clientBudget.js');

//router.route('/').all([ authJwt.verifyToken ]).get(clientBudget.list).post(clientBudget.insert);
router.route('/:id').all([ authJwt.verifyToken ]).get(clientBudget.get).put(clientBudget.update);
//.delete(clientBudget.remove);

module.exports = router;
