const database = require('../services/database.js');

// Get PostCode reference data on a GET HTTP request
async function getRefAddress() {
	console.log('Run: function getRefAddress() ');
	let state = queryParams.state == undefined ? 'VIC' : queryParams.state;
	let postcode = queryParams.postcode == undefined? null: queryParams.postcode ;
	let locality = queryParams.locality == undefined? null: queryParams.locality ;
	let bspName = queryParams.bspName == undefined? null: queryParams.bspName ;
	let selectOption = queryParams.selectOption == undefined? null: queryParams.selectOption ;


	let query =
		`DECLARE @locality NVARCHAR(50) = '` + locality + `'
		DECLARE @state NVARCHAR(3) =  '` + state + `'
		DECLARE @postCode NVARCHAR(6) =  '` + postcode + `'
		DECLARE @bspName NVARCHAR(255) = '` + bspName + `'
		DECLARE @selectOption NVARCHAR(50) = '` + selectOption + `'
		
		IF @selectOption = 'state'
		SELECT DISTINCT State FROM [Post Codes]
		ORDER BY State

		IF @selectOption = 'locality'
			BEGIN
				SELECT DISTINCT TOP(20) Locality FROM [Post Codes] WHERE LOWER(Locality) LIKE '%' + @locality+ '%'
				IF (@bspName IS NOT NULL) PRINT 'AND BSPName = ' + @bspName + ' ORDER BY Locality'
				IF (@state IS NOT NULL) PRINT 'AND State = ' + @state + ' ORDER BY Locality'
			END

		IF @selectOption = 'postcode'
			BEGIN
				SELECT DISTINCT TOP(20) Postcode FROM [Post Codes] WHERE Postcode LIKE '%' + @postcode + '%'
				IF (@bspName IS NOT NULL) PRINT 'AND BSPName = ' + @bspName + ' ORDER BY Locality'
				IF (@state IS NOT NULL) PRINT 'AND State = ' + @state + ' ORDER BY Locality'
				IF (@locality IS NOT NULL) PRINT 'AND Locality = ' + @locality + ' ORDER BY Locality'
			END

		IF @selectOption = 'bspName'
		SELECT DISTINCT BSPname FROM [Post Codes]
		ORDER BY BSPname`;

	console.log(query);
	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getRefAddress = getRefAddress;
