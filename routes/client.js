var router = require('express').Router();

const { authJwt } = require('../middleware');
const client = require('../controllers/client.js');
const clientContact = require('../controllers/clientContact.js');
const clientTask = require('../controllers/clientTask.js');
const clientNotRequired = require('../controllers/clientNotRequired.js');

router.route('/birthday').all([ authJwt.verifyToken ]).get(client.getClientBirthdays);
router.route('/charges-allocations').all([ authJwt.verifyToken ]).get(client.getClientChargesAllocations);
router
	.route('/charges-allocations-summary')
	.all([ authJwt.verifyToken ])
	.get(client.getClientChargesAllocationsSummary);

router.route('/:id').all([ authJwt.verifyToken ]).get(client.getClient).put(client.updateClient);
router.route('/').all([ authJwt.verifyToken ]).get(client.getClients).post(client.addClient);

router.route('/:clientId/contact').all([ authJwt.verifyToken ]).get(clientContact.getList).post(clientContact.insert);

router
	.route('/:clientId/contact/:id')
	.all([ authJwt.verifyToken ])
	.get(clientContact.get)
	.put(clientContact.update)
	.delete(clientContact.remove);

router.route('/:clientId/task').all([ authJwt.verifyToken ]).get(clientTask.getList).post(clientTask.insert);

router
	.route('/:clientId/task/:id')
	.all([ authJwt.verifyToken ])
	.get(clientTask.get)
	.put(clientTask.update)
	.delete(clientTask.remove);

router
	.route('/:clientId/not-required/is-overlapped')
	.all([ authJwt.verifyToken ])
	.get(clientNotRequired.isOverlapped)

router
	.route('/:clientId/not-required/:id')
	.all([ authJwt.verifyToken ])
	.get(clientNotRequired.get)
	.put(clientNotRequired.update)
	.delete(clientNotRequired.remove);

router
	.route('/:clientId/not-required')
	.all([ authJwt.verifyToken ])
	.get(clientNotRequired.list)
	.post(clientNotRequired.insert);



module.exports = router;
