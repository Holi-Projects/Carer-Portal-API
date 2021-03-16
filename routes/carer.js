var router = require('express').Router();

const { authJwt } = require('../middleware');
const carer = require('../controllers/carer.js');
const carerAvailability = require('../controllers/carerAvailability.js');
const carerDocument = require('../controllers/carerDocument.js');
const carerLanguage = require('../controllers/carerLanguage.js');
const carerSkill = require('../controllers/carerSkill.js');
const carerUnavailability = require('../controllers/carerUnavailability.js');
const calendar = require('../controllers/calendar.js');

router.route('/birthday').all([ authJwt.verifyToken ]).get(carer.getCarerBirthdays);
router.route('/timesheets-allocations').all([ authJwt.verifyToken ]).get(carer.getCarerTimesheetsAllocations);

router.route('/').all([ authJwt.verifyToken ]).get(carer.getCarers).post(carer.addCarer);
router.route('/:id').all([ authJwt.verifyToken ]).get(carer.getCarer).put(carer.updateCarer);

router.route('/:carerId/skill').all([ authJwt.verifyToken ]).get(carerSkill.getList).post(carerSkill.insert);

router
	.route('/:carerId/skill/:id')
	.all([ authJwt.verifyToken ])
	.get(carerSkill.get)
	.put(carerSkill.update)
	.delete(carerSkill.remove);

router.route('/:carerId/skill/:id/approve').all([ authJwt.verifyToken ]).post(carerSkill.approve);

/*router
	.route('/:carerId/skill/:id/document')
	.all([ authJwt.verifyToken ])
	.get(carerSkill.getDocumentList)
	.post(carerSkill.uploadDocument);
router.route('/:carerId/skill/:id/document/:name').all([ authJwt.verifyToken ]).get(carerSkill.downloadDocument2);*/

router.route('/:carerId/document').all([ authJwt.verifyToken ]).get(carerDocument.getList).post(carerDocument.insert);
router
	.route('/:carerId/document/:id')
	.all([ authJwt.verifyToken ])
	.get(carerDocument.get)
	.put(carerDocument.update)
	.delete(carerDocument.remove);

router.route('/:carerId/language').all([ authJwt.verifyToken ]).get(carerLanguage.getList).post(carerLanguage.insert);

router
	.route('/:carerId/language/:id')
	.all([ authJwt.verifyToken ])
	.get(carerLanguage.get)
	.put(carerLanguage.update)
	.delete(carerLanguage.remove);

router
	.route('/:carerId/availability')
	.all([ authJwt.verifyToken ])
	.get(carerAvailability.getList)
	.post(carerAvailability.insert);

router
	.route('/:carerId/availability/:id')
	.all([ authJwt.verifyToken ])
	.get(carerAvailability.get)
	.put(carerAvailability.update)
	.delete(carerAvailability.remove);

router
	.route('/:carerId/unavailability/:id')
	.all([ authJwt.verifyToken ])
	.get(carerUnavailability.get)
	.put(carerUnavailability.update)
	.delete(carerUnavailability.remove);

router
	.route('/:carerId/unavailability')
	.all([ authJwt.verifyToken ])
	.get(carerUnavailability.list)
	.post(carerUnavailability.insert);

// router.route('/:carerId/unavailable').all([ authJwt.verifyToken ]).get(carer.getCarerUnavailable);
//.post(carer.addCarerUnavailable)
/*router
	.route('/:carerId/unavailable/:id')
	.all([ authJwt.verifyToken ])
	.put(carer.updateCarerUnavailable)
	.delete(carer.deleteCarerUnavailable);*/

// router.route('/:carerId/unavailablility').all([ authJwt.verifyToken ]).get(carerUnavailability.getList);
// router.route('/:carerId/unavailablility').all([ authJwt.verifyToken ]).post(carerUnavailability.insert);

router.route('/:carerId/unavailable-day').all([ authJwt.verifyToken ]).get(carer.getCarerUnavailableDay);
router.route('/:carerId/calendar').all([ authJwt.verifyToken ]).get(calendar.getCalendar);

module.exports = router;
