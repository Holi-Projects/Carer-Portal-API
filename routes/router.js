// back in our API router
var router = require('express').Router();

// https://medium.com/@HargitaiSoma/how-you-should-have-started-to-add-swagger-to-your-express-api-672a6b0a6680
const swaggerUi = require('swagger-ui-express'),
	swaggerDocument = require('./openapi.js');

const pjson = require('../package.json');

swaggerDocument.info.version = pjson.version;
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.get('/health-check', (req, res) => {
	console.log('health check');
	return res.json('health check okay');
});

router.use('/auth', require('./auth'));

router.use('/agency', require('./agency'));
router.use('/agency-contact', require('./agency-contact'));
router.use('/agency-program', require('./agency-program'));
router.use('/audit-trail', require('./audit-trail'));
router.use('/carer', require('./carer'));
router.use('/client', require('./client'));
router.use('/contact-history', require('./contact-history'));
router.use('/employee', require('./employee'));
router.use('/follow-up', require('./follow-up'));
router.use('/incident', require('./incident'));
router.use('/ref', require('./ref'));
router.use('/booking', require('./booking'));
router.use('/standard-service', require('./standard-service'));
router.use('/file', require('./file'));
router.use('/funding-arrangement', require('./funding-arrangement'));
router.use('/sms', require('./sms'));
router.use('/schedule', require('./schedule'));
router.use('/calendar', require('./calendar'));

router.use('/hcp/financial-year', require('./hcp/financial-year'));
router.use('/hcp/leave-calc-mode', require('./hcp/leave-calc-mode'));
router.use('/hcp/leave-type', require('./hcp/leave-type'));
router.use('/hcp/management-level', require('./hcp/management-level'));
router.use('/hcp/level', require('./hcp/level'));
router.use('/hcp/rate', require('./hcp/rate'));
router.use('/hcp/supplement', require('./hcp/supplement'));
router.use('/hcp/supplement-rate', require('./hcp/supplement-rate'));
router.use('/hcp/supplier', require('./hcp/supplier'));
router.use('/hcp/inbound-type', require('./hcp/inbound-type'));
router.use('/hcp/inbound-transaction', require('./hcp/inbound-transaction'));
router.use('/hcp/client-hcp', require('./hcp/client-hcp'));
router.use('/hcp/client-supplement', require('./hcp/client-supplement'));
router.use('/hcp/administrative-fee', require('./hcp/administrative-fee'));
router.use('/hcp/client-admin-fee', require('./hcp/client-admin-fee'));
router.use('/hcp/client-management-level', require('./hcp/client-management-level'));
router.use('/hcp/client-contribution', require('./hcp/client-contribution'));
router.use('/hcp/client-contribution-type', require('./hcp/client-contribution-type'));
router.use('/hcp/booking-charges-detail', require('./hcp/booking-charges-detail'));
router.use('/hcp/supplier-service', require('./hcp/supplier-service'));
router.use('/hcp/client-leave-booking', require('./hcp/client-leave-booking'));
router.use('/hcp/client-leave-quota', require('./hcp/client-leave-quota'));
router.use('/hcp/client-initial-balance', require('./hcp/client-initial-balance'));
router.use('/hcp/client-initial-expenditure', require('./hcp/client-initial-expenditure'));
router.use('/hcp/client-initial-funding', require('./hcp/client-initial-funding'));
router.use('/hcp/outbound-type', require('./hcp/outbound-type'));
router.use('/hcp/outbound-transaction', require('./hcp/outbound-transaction'));
router.use('/hcp/client-budget', require('./hcp/client-budget'));
router.use('/hcp/adjustment-type', require('./hcp/adjustment-type'));
router.use('/hcp/client-adjustment-balance', require('./hcp/client-adjustment-balance'));
router.use('/hcp/client-daily-statement-data', require('./hcp/client-daily-statement-data'));
router.use('/hcp/client-monthly-statement', require('./hcp/client-monthly-statement'));

router.use('/hcp/statement', require('./hcp/statement'));
router.use('/hcp/myob', require('./hcp/myob'));

router.use('/subscription', require('./subscription'));

module.exports = router;
