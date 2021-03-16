var router = require('express').Router();

const { authJwt } = require('../middleware');
const agency = require('../controllers/agency.js');
const agencyContact = require('../controllers/agencyContact.js');
const agencyProgram = require('../controllers/agencyProgram.js');

router.route('/').all([ authJwt.verifyToken ]).get(agency.getList).post(agency.insert);
router.route('/:id').all([ authJwt.verifyToken ]).get(agency.get).put(agency.update).delete(agency.remove);

router
	.route('/:agencyId/contact')
	.all([ authJwt.verifyToken ])
	.get(agencyContact.getAgencyContacts)
	.post(agencyContact.addAgencyContact);

router
	.route('/:agencyId/contact/:contactId')
	.all([ authJwt.verifyToken ])
	.get(agencyContact.getAgencyContact)
	.put(agencyContact.updateAgencyContact)
	.delete(agencyContact.deleteAgencyContact);

router
	.route('/:agencyId/program')
	.all([ authJwt.verifyToken ])
	.get(agencyProgram.getAgencyPrograms)
	.post(agencyProgram.addAgencyProgram);

router
	.route('/:agencyId/program/:programId')
	.all([ authJwt.verifyToken ])
	.get(agencyProgram.getAgencyProgram)
	.put(agencyProgram.updateAgencyProgram)
	.delete(agencyProgram.deleteAgencyProgram);

module.exports = router;
