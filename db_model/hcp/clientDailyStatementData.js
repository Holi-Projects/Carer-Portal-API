const dataFields = {
	clientId                       : '[ClientID]',
	date                           : '[Date]',
	ratio                          : '[Ratio]',
	hcpAmount                      : '[HCPAmount]',
	mgmtRate                       : '[MgmtRate]',
	suppAmount                     : '[SuppAmount]',
	basicDailyFee                  : '[BasicDailyFee]',
	incomeTestedFee                : '[IncomeTestedFee]',
	thirdPartyServiceCost          : '[ThirdPartyServiceCost]',
	adminRate                      : '[AdminRate]',
	carerServiceCost               : '[CarerServiceCost]',
	clientContributionAdjustAmount : '[ClientContributionAdjustAmount]',
	govContributionAdjustAmount    : '[GovContributionAdjustAmount]',
	clientExpenditureAdjustAmount  : '[ClientExpenditureAdjustAmount]',
	adminFeeAdjust                 : '[AdminFeeAdjust]',
	advisoryFeeAdjust              : '[AdvisoryFeeAdjust]',
	clientTransferAdjust           : '[ClientTransferAdjust]',
	govTransferAdjust              : '[GovTransferAdjust]',
};

const dateTimeFields = {
	//date      : '[Date]',
	timestamp : '[timestamp]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[ClientDailyStatementData]',
	//primaryKey     : dataFields.id, // This table has a composite PK (ClientID, Date)
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
