const subscriptions = {};
var crypto = require('crypto');
const webpush = require('web-push');

/*
const vapidKeys = {
	privateKey : 'bdSiNzUhUP6piAxLH-tW88zfBlWWveIx0dAsDO66aVU',
	publicKey  : 'BIN2Jc5Vmkmy-S3AUrcMlpKxJpLeVRAfu9WBqUbJ70SJOCWGCGXKY-Xzyh7HDr6KbRDGYHjqZ06OcS3BjD7uAm8',
};


webpush.setVapidDetails('mailto:example@yourdomain.org', vapidKeys.publicKey, vapidKeys.privateKey);
*/
// generated from https://d3v.one/vapid-key-generator/
const vapidKeys = {
	subject    : 'mailto:you@example.com',
	publicKey  : 'BPRslWbts8Qrb5n2rSlZxMkqYQMIJtDSKAFgDC9-7QS4HFTwRoF8qjp69UheF181gvNWElxf-G4aDOyTN10R6mU',
	privateKey : 'PabtGR8ARsCTmznZ1WEmEM33F-yGcLacl-rEhzeS7AQ',
};

webpush.setVapidDetails(vapidKeys.subject, vapidKeys.publicKey, vapidKeys.privateKey);

function createHash(input) {
	const md5sum = crypto.createHash('md5');
	md5sum.update(Buffer.from(input));
	return md5sum.digest('hex');
}

function handlePushNotificationSubscription(req, res) {
	const subscriptionRequest = req.body;
	console.log('subscriptionRequest = ' + JSON.stringify(subscriptionRequest));
	console.log(subscriptionRequest);
	const susbscriptionId = createHash(JSON.stringify(subscriptionRequest));
	subscriptions[susbscriptionId] = subscriptionRequest;
	res.status(201).json({ id: susbscriptionId });
}

function sendPushNotification(req, res) {
	const subscriptionId = req.params.id;
	const pushSubscription = subscriptions[subscriptionId];
	webpush
		.sendNotification(
			pushSubscription,
			JSON.stringify({
				title : 'New Product Available ',
				text  : 'HEY! Take a look at this brand new t-shirt!',
				image : '/images/jason-leung-HM6TMmevbZQ-unsplash.jpg',
				tag   : 'new-product',
				url   : '/new-product-jason-leung-HM6TMmevbZQ-unsplash.html',
			})
		)
		.catch((err) => {
			console.log(err);
		});

	res.status(202).json({});
}

module.exports = { handlePushNotificationSubscription, sendPushNotification };
