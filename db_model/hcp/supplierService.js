const dataFields = {
	id                 : '[SupplierServiceID]',
	clientId           : '[ClientID]',
	supplierId         : '[SupplierID]',
	accountNo          : '[AccountNo]',
	supplierInvNo      : '[SupplierInvNo]',
	amount             : '[Amount]',
	GST                : '[GST]',
	totalAmount        : '[TotalAmount]',
	purchaseStatus     : '[PurchaseStatus]',
	serviceDescription : '[ServiceDescription]',
};

const dateTimeFields = {
	invoiceDate : '[InvoiceDate]',
	timestamp   : '[timestamp]',
};

const timeFields = {};

const dbModel = {
	tableName      : '[SupplierServices]',
	primaryKey     : dataFields.id,
	dataFields     : dataFields,
	dateTimeFields : dateTimeFields,
	timeFields     : timeFields,
};

module.exports.dbModel = dbModel;
