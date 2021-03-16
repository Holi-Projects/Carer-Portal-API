// back in our API router
var router = require('express').Router();

const { authJwt } = require('../middleware');
const file = require('../controllers/fileManager.js');

router.route('/fetchDir').get([ authJwt.verifyToken ], file.fetchDir); // supports query parameter
router.route('/fetchPdf').get([ authJwt.verifyToken ], file.fetchPdf); // supports query parameter

router.route('/upload-file').post([ authJwt.verifyToken ], file.upload);

router.route('/getItems').get(file.getItems);
router.route('/createDirectory').post(file.createDirectory);
router.route('/renameItem').post(file.renameItem);
router.route('/deleteItem').post(file.deleteItem);
router.route('/copyItem').post(file.copyItem);
router.route('/moveItem').post(file.moveItem);
router.route('/uploadFileChunk').post(file.uploadFileChunk);
router.route('/downloadItem').get(file.downloadItem);

module.exports = router;
