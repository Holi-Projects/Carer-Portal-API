const database = require('../services/database.js');
const dateTimeUtil = require('../utils/dateTimeUtil');

// Get agency reference data on a GET HTTP request
async function getRefClientFunding(user, queryParams) {
	console.log('Run: function getRefClientFunding() ');
	console.log(queryParams);
    let query = ``;
    if (queryParams.id !== undefined) {

    query += `
        DECLARE @scheduleStartDate DATE = (SELECT [Schedule Start Date] FROM [Clients Schedule]
            WHERE [Client Schedule Seq No] = ${queryParams.id} )

        DECLARE @scheduleEndDate DATE = (SELECT [Schedule Finish Date] FROM [Clients Schedule]
            WHERE [Client Schedule Seq No] = ${queryParams.id} )
            
        SELECT [SeqNo] AS agencyClientId
            ,[Agency ID] AS agencyId
            ,[Client ID] AS clientId
            ,[Client ID Payer] AS clientPayerId
            ,${queryParams.id} AS clientScheduleId`
            
    } else {
        query += `
        SELECT [SeqNo] AS agencyClientId
        ,[Agency ID] AS agencyId
        ,[Client ID] AS clientId
        ,[Client ID Payer] AS clientPayerId`
    }
    
   
    query += `
    , CASE
            WHEN (A.[Agency ID] IS NOT NULL) THEN A.[Agency ID]
            WHEN (A.[Agency ID] IS NULL AND A.[Client ID Payer] IS NOT NULL) THEN A.[Client ID Payer]
            ELSE A.[Client ID]
    END AS fundingId

    , CASE
            WHEN (A.[Agency ID] IS NOT NULL) THEN B.Company
            WHEN (A.[Agency ID] IS NULL AND A.[Client ID Payer] IS NOT NULL) THEN C2.[First Name] + ' ' + C2.[Last Name]
            ELSE C1.[First Name] + ' ' + C1.[Last Name]
	END AS fundingName

    , CASE
            WHEN (A.[Agency ID] IS NOT NULL) THEN D1.[PricingGroupName]
            WHEN (A.[Agency ID] IS NULL AND A.[Client ID Payer] IS NOT NULL) THEN D2.[PricingGroupName]
            ELSE D1.[PricingGroupName]
    END AS pricingGroupName
    , CASE
            WHEN (A.[Agency ID] IS NOT NULL) THEN B.[PricingGroupNo]
            WHEN (A.[Agency ID] IS NULL AND A.[Client ID Payer] IS NOT NULL) THEN C2.[PricingGroupNo]
            ELSE C1.[PricingGroupNo]
    END AS pricingGroupId
    
    FROM [CarerDataDev].[dbo].[Agencies Clients] A
    LEFT JOIN [dbo].[Agencies] B  ON A.[Agency ID] = B.ID
    LEFT JOIN [dbo].[Clients] C1 ON A.[Client ID] = C1.ID
    LEFT JOIN [dbo].[Clients] C2 ON A.[Client ID Payer] = C2.ID
    LEFT JOIN [Ref Pricing Groups] D1 ON B.[PricingGroupNo] = D1.PricingGroupNo
    LEFT JOIN [Ref Pricing Groups] D2 ON C1.[PricingGroupNo] = D2.PricingGroupNo
    LEFT JOIN [Ref Pricing Groups] D3 ON C2.[PricingGroupNo] = D3.PricingGroupNo`;

    if (queryParams.id !== undefined) {

    query += `\nAND ${dateTimeUtil.areRangesOverlapping('A.[Service Start Date]', 'A.[Service Finish Date]', `@scheduleStartDate`, `@scheduleEndDate`)}
     `;
    } else {
    query += `\nAND A.[Service Finish Date] IS NULL`
    }


    query += `\nWHERE [Client ID] = ${queryParams.clientId}
    AND C1.[CompanyID] = ${user.companyId}`
	console.log(query);

	const result = await database.simpleExecute(query);
	return result.recordset;
}

module.exports.getRefClientFunding = getRefClientFunding;
