const dataFields = {
	month                          : '[Month]',
	year                           : '[Year]',
	clientId                       : '[ClientID]',
	basicDailyFee                  : '[BasicDailyFee]',
	incomeTestedFee                : '[IncomeTestedFee]',
	governmentSubsidy              : '[GovernmentSubsidy]',
	suppSubsidy                    : '[SuppSubsidy]',
	careServices                   : '[CareServices]',
	thirdPartyServices             : '[ThirdPartyServices]',
	administrativeFee              : '[AdministrativeFee]',
	coreAdvisoryFee                : '[CoreAdvisoryFee]',
	openBalance                    : '[OpenBalance]',
	closeBalance                   : '[CloseBalance]',
	totalFunding                   : '[TotalFunding]',
	totalExpenditure               : '[TotalExpenditure]',
	receivedIncomeTestedFee        : '[ReceivedIncomeTestedFee]',
	receivedGovernmentSubsidy      : '[ReceivedGovernmentSubsidy]',
	receivedSuppSubsidy            : '[ReceivedSuppSubsidy]',
	receivedTotalFunding           : '[ReceivedTotalFunding]',
	clientContributionAdjustAmount : '[ClientContributionAdjustAmount]',
	govContributionAdjustAmount    : '[GovContributionAdjustAmount]',
	clientExpenditureAdjustAmount  : '[ClientExpenditureAdjustAmount]',
	exitFee                        : '[ExitFee]',
	advisoryFeeAdjust              : '[AdvisoryFeeAdjust]',
	adminFeeAdjust                 : '[AdminFeeAdjust]',
	clientTransferAdjust           : '[ClientTransferAdjust]',
	govTransferAdjust              : '[GovTransferAdjust]',
};

const dateTimeFields = {
	timestamp : '[timestamp]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[ClientMonthlyStatement]',
	//primaryKey     : dataFields.id,  // This table has a composite PK (Month, Year, ClientID)
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
