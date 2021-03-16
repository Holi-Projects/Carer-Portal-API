const fs = require('fs');
const supplierService = require('../../db_apis/hcp/supplierService.js');
const tools = require('../../utils/tools.js');

async function createFile(req, res, next) {
	console.log('controllers:myob.createFile(req, res, next)');
	console.log(req.body);
	try {
		const result = await supplierService.list(req.user, req.body);
		console.log(result);

		//let FilePath = context.rootpath + context.filename;
		const filePath = `C:\\Sequel\\myob\\purchase-services-${Date.now()}.txt`;
		let columnLabel = [
			'Co./Last Name',
			'First Name',
			'Addr 1',
			'Addr 2',
			'Addr 3',
			'Addr 4',
			'Inclusive',
			'Purchase #',
			'Date',
			'Supplier Invoice #',
			'Ship Via',
			'Delivery Status',
			'Description',
			'*Account #',
			'*Amount',
			'*Inc-Tax Amount',
			'Job',
			'Comment',
			'Journal Memo',
			'Shipping Date',
			'GST Code',
			'Non-GST Amount',
			'GST Amount',
			'Import Duty Amount',
			'Freight Amount',
			'*Inc-Tax Freight Amount',
			'Freight GST Code',
			'Freight Non-GST Amount',
			'Freight GST Amount',
			'Freight Import Duty Amount',
			'Purchase Status',
			'Currency Code',
			'Exchange Rate',
			'Terms/Payment is Due',
			'Terms/Discount Days',
			'Terms/Balance Due Days',
			'Terms/%Discount',
			'Amount Paid',
			'Category',
			'Card ID',
			'Record ID',
		];
		let labelRow = columnLabel.join('\t').concat('\n');
		console.log('1');
		let dataRow = '';
		//  let data = req.body;
		// let data = post;
		console.log('2');
		//  console.log(data);

		result.forEach((item) => {
			let Inclusive = '';
			let GSTCode = item.GST > 0 ? 'GST' : 'FRE';
			// let GSTAmount = item.GST*11;
			// let NonGSTAmount = item.Amount - item.GST*11;
			let rowObj = {
				'Co./Last Name'              : item.supplierName,
				'First Name'                 : '',
				'Addr 1'                     : item.supplierAddress,
				'Addr 2'                     : item.supplierCity,
				'Addr 3'                     : item.supplierState + ' ' + item.supplierPostcode,
				'Addr 4'                     : '',
				Inclusive                    : Inclusive,
				'Purchase #'                 : item.id,
				//Date                         : tools.dateToString(item.invoiceDate), //?? what is the date format expected by MYOB ??
				Date                         : item.invoiceDate.toLocaleString(), //?? what is the date format expected by MYOB ??
				'Supplier Invoice #'         : item.supplierInvNo,
				'Ship Via'                   : '',
				'Delivery Status'            : '',
				Description                  : item.serviceDescription,
				'*Account #'                 : item.accountNo,
				'*Amount'                    : item.amount,
				'*Inc-Tax Amount'            : item.totalAmount,
				Job                          : item.clientJobRef,
				Comment                      : item.clientJobRef,
				// "Comment":item.LastName+item.FirstName.substring(0,1)+'-'+'Sequel',
				'Journal Memo'               : '',
				'Shipping Date'              : tools.dateToString(item.invoiceDate),
				'GST Code'                   : GSTCode,
				'Non-GST Amount'             : '',
				'GST Amount'                 : item.GST,
				'Import Duty Amount'         : '',
				'Freight Amount'             : '',
				'*Inc-Tax Freight Amount'    : '',
				'Freight GST Code'           : '',
				'Freight Non-GST Amount'     : '',
				'Freight GST Amount'         : '',
				'Freight Import Duty Amount' : '',
				'Purchase Status'            : item.purchaseStatus,
				'Currency Code'              : '',
				'Exchange Rate'              : '',
				'Terms/Payment is Due'       : '',
				'Terms/Discount Days'        : '',
				'Terms/Balance Due Days'     : '',
				'Terms/%Discount'            : '',
				'Amount Paid'                : '',
				Category                     : '',
				'Card ID'                    : '*None',
				'Record ID'                  : '',
			};
			console.log('3');
			let rowArr = [];
			Object.keys(rowObj).forEach((key) => {
				rowArr.push(rowObj[key]);
			});

			dataRow += rowArr.join('\t').concat('\n');
		});
		let fileContent = labelRow + dataRow;
		console.log('4');
		console.log(fileContent);
		//data2 = JSON.stringify(req.body)
		fs.writeFile(filePath, fileContent, 'utf8', function(err) {
			if (err) {
				res.send('Failed to write data');
				console.error(err.stack);
				next(err);
			} else {
				// console.log("OK");
				// console.log(req.headers);
				console.log('The file was created');
				res.status(200);
				res.send('The file was created');
			}
		});

		//if (result.rowsAffected.length === 1 && result.rowsAffected[0] === 1) {
		/*return res.status(201).send({
			success : 'true',
			message : 'MYOB File created successfully',
			//id      : result.recordset[0].id,
		});*/
		//} else {
		//	res.status(404).end('200');
		//}
	} catch (err) {
		console.error(err.stack);
		next(err);
	}
}
module.exports.createFile = createFile;
