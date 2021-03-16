var router = require('express').Router();

const { authJwt } = require('../middleware');
const incident = require('../controllers/incident.js');
const incidentDocument = require('../controllers/incidentDocument.js');

// document routes must be defined first to avoid  confusion with '/:id'
router.route('/document').all([ authJwt.verifyToken ]).get(incidentDocument.getList).post(incidentDocument.insert);
router
	.route('/document/:id')
	.all([ authJwt.verifyToken ])
	.get(incidentDocument.get)
	.put(incidentDocument.update)
	.delete(incidentDocument.remove);

router.route('/').all([ authJwt.verifyToken ]).get(incident.getList).post(incident.insert);
router.route('/:id').all([ authJwt.verifyToken ]).get(incident.get).put(incident.update).delete(incident.remove);

module.exports = router;
