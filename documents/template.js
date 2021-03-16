function summayStatement(record) {
	console.log('summayStatement(record) - template.js');
	let currentDir = __dirname.replace(/\\/g, '/');
	let filePath = 'file:///' + currentDir;
	console.log('summayStatement-template-filePath:' + filePath);
	const tools = require('../utils/tools.js');

	console.log(record);

	content = `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <link id='stylecss' type="text/css" rel="stylesheet" href="${filePath}/index.css">
          
       </head>
       <body>
       <section class="receipt">
       <table class="receipt w80" cellpadding="0">`;
	let packageLevel = '';
	// If there is one record of hcp level within a month
	if (record.PackageLevel.length == 1)
		record.PackageLevel.forEach((element) => {
			packageLevel = 'HCP Level ' + element.HCPLevelCode;
		});

	// If there are multiple records of hcp level within a month
	if (record.PackageLevel.length > 1)
		record.PackageLevel.forEach((element) => {
			let startDate =
				element.StartDate !== null
					? tools.compareDate(record.StartDate, element.StartDate)
						? tools.userFormatDate(record.StartDate)
						: tools.formatDateStyle3(element.StartDate)
					: 'N/A';
			let endDate = element.EndDate !== null ? tools.formatDateStyle3(element.EndDate) : 'N/A';
			packageLevel +=
				'<span>HCP Level ' + element.HCPLevelCode + '(' + startDate + ' -> ' + endDate + ')</span><br>';
		});

	let mgmtLevel = '';
	// If there is one record of management level within a month
	if (record.ManagementLevel.length == 1)
		record.ManagementLevel.forEach((element) => {
			mgmtLevel = element.Code == 'S/M' ? 'Self Directed HCP' : element.Code == 'C/M' ? 'Case Managed HCP' : '';
		});

	// If there are multiple records of management level within a month
	if (record.ManagementLevel.length > 1)
		record.ManagementLevel.forEach((element) => {
			let startDate =
				element.StartDate !== null
					? tools.compareDate(record.StartDate, element.StartDate)
						? tools.userFormatDate(record.StartDate)
						: tools.formatDateStyle3(element.StartDate)
					: 'N/A';
			let endDate = element.EndDate !== null ? tools.formatDateStyle3(element.EndDate) : 'N/A';
			let level = element.Code == 'S/M' ? 'Self Directed HCP' : element.Code == 'C/M' ? 'Case Managed HCP' : '';
			mgmtLevel += '<span>' + level + '(' + startDate + ' -> ' + endDate + ')</span><br>';
		});

	console.log(mgmtLevel);

	content += `
       <thead class="receipt noBorder">
            <tr>
                <td colspan="5" height="50px"></td>
            </tr>
           <tr>
               <td colspan="2" class="w30">
                   <img src="${filePath}/logo.png" width="180px" alt="logo" >
               </td>
               <td colspan="3" rowspan="2"  class="w70">
                    <table class="receipt-header noBorder w100">
                    <tr><td colspan="2"><h2>Home Care Package (BUDGET) Statement</h2><td></tr>
                    <tr><td class="w30">Period: </td><td class="w70 bolder">${record.Period}</td></tr>
                    <tr><td class="w30">Client:</td><td class="w70 bolder">${record.FullName}</td></tr>
                    <tr><td class="w30">Address:</td><td class="w70">${record.AddressLine1}, ${record.AddressLine2}</td></tr>
                    <tr><td class="w30">Account No.:</td><td class="w70">${record.AccountNumber}</td></tr>
                    <tr><td class="w30">Package Level:</td><td class="w70">${packageLevel}</td></tr>
                    <tr><td class="w30">Package Tier:</td><td class="w70">${mgmtLevel}</td></tr>
                    </table>
               </td>
           </tr>

           <tr>
               <td colspan="2" >
               <span>ABN: 60 099 647 515</span><br>
               <br>
               <span>Suite 112</span><br>
               <span>Level 1</span><br>
               <span>40 Burgundy Street</span><br>
               <span>Heidelberg VIC 3084</span>      
               </td>
           </tr>

           <tr>
                <td colspan="5" height="50px"></td>
            </tr>
       </thead>`;
	let startPeriod = tools.isSameMonthAndYear(record.StartDate, record.ServiceStartDate)
		? record.ServiceStartDate
		: record.StartDate;
	content += `
       <tbody class="receipt withBorder">
           <tr>
               <td colspan="2" class="smallTitle rightText w33">OPENING BALANCE: </td>
               <td colspan="2" class="rightText w33" >${formatDate(startPeriod)}</td>
               <td class="rightText bolder w33">${record.OpenBalance}</td>
           </tr>
           <tr>
               <th colspan="5">Package funding for the month</th>
           </tr>
           <tr>
               <th colspan="5">Client contribution</th>
           </tr>
           <tr>
               <td class="w2 noBorderRight"></td>
               <td class="noBorderLeft">Basic daily fee*</td>
               <td colspan="2" class="rightText">${record.BasicDailyFee}</td>
               <td></td>
           </tr>
           <tr>
               <td class="w2 noBorderRight"></td>
               <td class="noBorderLeft">Income-tested care fee*</td>
               <td colspan="2" class="rightText">${record.IncomeTestedFee}</td>
               <td></td>
           </tr>`;
	if (Number(record.ClientContributionAdjustAmount) != 0)
		content += `
           <tr>
               <td class="w2 noBorderRight"></td>
               <td class="noBorderLeft">Adjustments**</td>
               <td colspan="2" class="rightText">${record.ClientContributionAdjustAmount}</td>
               <td></td>
           </tr>`;
	content += `
           <tr>
               <th colspan="5">Government contribution </th>
           </tr>
           <tr>
               <td class="w2 noBorderRight"></td>
               <td class="noBorderLeft">Home Care Subsidy</td>
               <td colspan="2" class="rightText">${record.GovernmentSubsidy}</td>
               <td></td>
           </tr>
           <tr>
               <td class="w2 noBorderRight"></td>
               <td class="noBorderLeft">Supplements</td>
               <td colspan="2" class="rightText">${record.SuppSubsidy}</td>
               <td></td>
           </tr>`;

	if (Number(record.GovContributionAdjustAmount) != 0)
		content += `
           <tr>
               <td class="w2 noBorderRight"></td>
               <td class="noBorderLeft">Adjustments**</td>
               <td colspan="2" class="rightText">${record.GovContributionAdjustAmount}</td>
               <td></td>
           </tr>`;

	if (Number(record.ClientTransferAdjust) != 0 || Number(record.GovTransferAdjust) != 0)
		content += `
           <th colspan="2">Transfers (received from previous Providers - if applicable)</th><th></th>`;

	if (Number(record.ClientTransferAdjust) != 0)
		content += `
           <tr>
               <td class="w2 noBorderRight"></td>
               <td class="noBorderLeft">Client portion adjustments**</td>
               <td colspan="2" class="rightText">${record.ClientTransferAdjust}</td>
               <td></td>
           </tr>`;

	if (Number(record.GovTransferAdjust) != 0)
		content += `
           <tr>
               <td class="w2 noBorderRight"></td>
               <td class="noBorderLeft">Government portion adjustments**</td>
               <td colspan="2" class="rightText">${record.GovTransferAdjust}</td>
               <td></td>
           </tr>`;

	content += `
           <tr>
               <td colspan="4" class="smallTitle">TOTAL INCOMINGS FOR THE MONTH:</td>
               <td class="rightText bolder">${(Number(record.TotalFunding) +
					Number(record.TransferAdjustAmount)).toFixed(2)}</td>
           </tr>
           <tr>
               <th colspan="5">Expenditure items for the month</th>
           </tr>
           <tr>
               <td class="w2 noBorderRight"></td>
               <td class="noBorderLeft">Home care services**</td>
               <td colspan="2" class="rightText">${record.CareServices}</td>
               <td></td>
           </tr>
           
          
           <tr>
               <td class="w2 noBorderRight"></td>
               <td class="noBorderLeft">Third parties services**</td>
               <td colspan="2" class="rightText">${record.ThirdPartyServices}</td>
               <td></td>
           </tr>

           <tr>
                <td class="w2 noBorderRight"></td>
                <td class="noBorderLeft">Package Management Fee***</td>
                <td colspan="2" class="rightText">${(Number(record.AdministrativeFee) +
					Number(record.CoreAdvisoryFee)).toFixed(2)}</td>
                <td></td>
           </tr>

           <tr>
               <td class="w2 noBorderRight"></td>
               <td class="noBorderLeft">Care Management Fee</td>
               <td colspan="2" class="rightText">0.00</td>
               <td></td>
           </tr>`;

	if (Number(record.OutboundAdjustAmount) != 0)
		content += `
           <tr>
               <td class="w2 noBorderRight"></td>
               <td class="noBorderLeft">Adjustments**</td>
               <td colspan="2" class="rightText">${record.OutboundAdjustAmount}</td>
               <td></td>
           </tr>`;
	let endPeriod = tools.isSameMonthAndYear(record.EndDate, record.ServiceFinishDate)
		? record.ServiceFinishDate
		: record.EndDate;
	content += `<tr>
               <td colspan="4" class="smallTitle">TOTAL EXPENDITURE FOR THE MONTH</td>
               <td class="rightText bolder">${record.TotalExpenditure}</td>
           </tr>
          
            <tr class="rightText">
                <td colspan="2" class="smallTitle rightText">CLOSING BALANCE:</td>
                <td colspan="2" class="rightText">${formatDate(endPeriod)}</td>
                <td class="rightText bolder">${record.CloseBalance}</td>
            </tr>
           </tbody>
           <tfoot class="receipt noBorder">
               <tr>
                   <td colspan="5" height="50px"></td>
               </tr>
               <tr>
                   <td colspan="5" class="leftText">
                   <span class="bolder">Note:</span>
                   <ul> 
                        <li>This BUDGET statement shows the budgeted Income-Tested Fee and Government Subsidy expected for the month</li>
                        <li>This statement is for your information only - No payment is required</li>
                        <li>* An Invoice/Statement for client contribution fee will be sent seperately</li>
                        <li>** Details are in the next pages.</li>
                        <li>*** Prior to 1st July 2020, Sequel charged an Administration Fee of 10%  and a Care Advisory/ Service Coordination fee of 10%  from your Home Care Package. This is now combined to become a Package Management Fee of 20% of your Home Care Package.</li>
                    </ul>
                   </td>
                </tr>
           </tfoot>
       </table>
       <br><div style="page-break-after:always;"></div>`;

	//    content += `
	//    <table class="receipt w80">
	//    <thead class="receipt noBorder">
	//         <tr>
	//             <th colspan="3"style="width:100%" >
	//                 <img src="${filePath}/logo.png" width="400px" alt="logo">
	//             </th>
	//             <th colspan="3" style="width:100%" >
	//             <h2>Home Care Service Details</h2>
	//             <br> <span> Period: </span><span>${record.Period}</span>
	//             <br> <span> Client: </span><span>${record.FullName}</span>
	//             </th>
	//         </tr>
	//         <tr>
	//             <td colspan="6" height="60px"></td>
	//         </tr>
	//    </thead>
	//    <tbody class="receipt withBorder">
	//        <tr>
	//            <th class="w25">Date of Services</th>
	//            <th class="w5">Units</th>
	//            <th class="w5">UoM</th>
	//            <th class="w25">Description</th>
	//            <th class="w20">Unit rate ($) </th>
	//            <th class="w20">Amount ($) </th>
	//        </tr>` ;

	// Financial and balance statement
	content += `
    <table class="receipt w80">
    <thead class="receipt noBorder">
        <tr>
            <td colspan="6" height="50px"></td>
        </tr>
        <tr>
            <th colspan="1" >
            <img src="${filePath}/logo.png" width="180px" alt="logo">
            </th>
            <td colspan="3"><h2>Home Care Package (FINANCIAL) Statement</h2>       
            <span> Client: </span><span class="bolder">${record.FullName}</span>
            <br> <br>  <span> Period: </span><span class="bolder">${record.Period}</span>
            </td>
         </tr>
         <tr>
         <td colspan="4" height="50px"></td>
         </tr>
    </thead>`;
	try {
		// initial balance data
		let initialBalance = Number(record.InitialBalance[0]['amount']);
		let initialGovPortion = Number(record.InitialBalance[0]['governmentPortion']);
		let initialClientPortion = Number(record.InitialBalance[0]['clientPortion']);

		// Previous preriod balance data
		let balance1 =
			Number(record.PreviousStatementData['GovTransferAdjust']) +
			Number(record.PreviousStatementData['ClientTransferAdjust']) +
			initialBalance;
		let govPortion1 = Number(record.PreviousStatementData['GovTransferAdjust']) + initialGovPortion;
		let clientPortion1 = Number(record.PreviousStatementData['ClientTransferAdjust']) + initialClientPortion;

		// This preriod balance data
		let balance2 = Number(record.GovTransferAdjust) + Number(record.ClientTransferAdjust);
		let govPortion2 = Number(record.GovTransferAdjust);
		let clientPortion2 = Number(record.ClientTransferAdjust);

		// Previous period data
		let expectedClientPayment1 =
			Number(record.PreviousStatementData.ExpectedClientContribution) +
			Number(record.PreviousStatementData.ExpectedClientContributionAdjust);
		let expectedGovPayment1 =
			Number(record.PreviousStatementData.ExpectedGovernmentContribution) +
			Number(record.PreviousStatementData.ExpectedSuppContribution) +
			+Number(record.PreviousStatementData.ExpectedGovernmentContributionAdjust);
		let receivedClientPayment1 = Number(record.PreviousStatementData.ReceivedClientContribution);
		let receivedGovPayment1 = Number(record.PreviousStatementData.ReceivedGovernmentContribution);
		let unreceivedClientPayment1 = expectedClientPayment1 - receivedClientPayment1;
		let unreceivedGovPayment1 = expectedGovPayment1 - receivedGovPayment1;
		let expectedTotal1 = Number(record.PreviousStatementData.ExpectedTotalFunding) + balance1;
		// let receivedTotal1 = receivedClientPayment1 + receivedGovPayment1;
		// let unreceivedTotal1 = unreceivedClientPayment1 + unreceivedGovPayment1;

		let servicesExpenditure1 =
			Number(record.PreviousStatementData.ServicesExpenditure) +
			Number(record.PreviousStatementData.ServicesExpenditureAdjust);
		let adminExpenditure1 =
			Number(record.PreviousStatementData.AdminExpenditure) +
			Number(record.PreviousStatementData.AdminExpenditureAdjust);
		let advisoryExpenditure1 =
			Number(record.PreviousStatementData.AdvisoryExpenditure) +
			Number(record.PreviousStatementData.AdvisoryExpenditureAdjust);
		let totalExpenditure1 = Number(record.PreviousStatementData.ExpectedTotalExpenditure);

		// This Previous data
		let expectedClientPayment2 =
			Number(record.BasicDailyFee) +
			Number(record.IncomeTestedFee) +
			Number(record.ClientContributionAdjustAmount);
		let expectedGovPayment2 =
			Number(record.GovernmentSubsidy) + Number(record.SuppSubsidy) + Number(record.GovContributionAdjustAmount);
		let receivedClientPayment2 = Number(record.ReceivedClientContribution);
		let receivedGovPayment2 = Number(record.ReceivedGovernmentSubsidy) + Number(record.ReceivedSuppSubsidy);
		let unreceivedClientPayment2 = expectedClientPayment2 - receivedClientPayment2;
		let unreceivedGovPayment2 = expectedGovPayment2 - receivedGovPayment2;
		let expectedTotal2 = expectedClientPayment2 + expectedGovPayment2 + balance2;
		// let receivedTotal2 = receivedClientPayment2 + receivedGovPayment2;
		// let unreceivedTotal2 = unreceivedClientPayment2 + unreceivedGovPayment2;

		let totalExpenditure2 = Number(record.TotalExpenditure);
		let servicesExpenditure2 =
			Number(record.CareServices) +
			Number(record.ThirdPartyServices) +
			Number(record.ClientExpenditureAdjustAmount);
		let adminExpenditure2 = Number(record.AdministrativeFee) + Number(record.AdminFeeAdjust);
		let advisoryExpenditure2 = Number(record.CoreAdvisoryFee) + Number(record.AdvisoryFeeAdjust);

		// Total data
		let totalExpenditure = totalExpenditure1 + totalExpenditure2;
		let servicesExpenditure = servicesExpenditure1 + servicesExpenditure2;
		let adminExpenditure = adminExpenditure1 + adminExpenditure2;
		let advisoryExpenditure = advisoryExpenditure1 + advisoryExpenditure2;

		let unreceivedClientPayment = unreceivedClientPayment1 + unreceivedClientPayment2;
		let unreceivedGovPayment = unreceivedGovPayment1 + unreceivedGovPayment2;

		let expectedClientPayment = expectedClientPayment1 + expectedClientPayment2;
		let expectedGovPayment = expectedGovPayment1 + expectedGovPayment2;

		let receivedClientPayment = receivedClientPayment1 + receivedClientPayment2;
		let receivedGovPayment = receivedGovPayment1 + receivedGovPayment2;

		let expectedTotal = expectedTotal1 + expectedTotal2;

		// Total balance data
		let balance = balance1 + balance2;
		let govPortion = govPortion1 + govPortion2;
		let clientPortion = clientPortion1 + clientPortion2;

		content +=
			`
    <tbody class="receipt withBorder">
        <tr>
            <th class="w40 smallTitle">INBOUND</th>
            <th class="w20 rightText">Previous periods</th>
            <th class="w20 rightText">This period</th>
            <th class="w20 rightText">Current Balance</th>
        </tr>
        <tr>
            <th colspan="4">Government contribution (subsidy)
            </th>
        </tr>
        <tr>
            <th>Total Government contribution (excl. transfer)</th>
            <th class="rightText">` +
			expectedGovPayment1.toFixed(2) +
			`</th>
            <th class="rightText">` +
			expectedGovPayment2.toFixed(2) +
			`</th>
            <th class="rightText">` +
			expectedGovPayment.toFixed(2) +
			`</th>
        </tr>

        <tr>
            <td>+ Payment received (excl. transfer)</td>
            <td class="rightText"> ` +
			receivedGovPayment1.toFixed(2) +
			`</td>
            <td class="rightText"> ` +
			receivedGovPayment2.toFixed(2) +
			`</td>
            <td class="rightText">` +
			receivedGovPayment.toFixed(2) +
			`</td>
        </tr>

        <tr>
            <td>+ Payment NOT received</td>
            <td class="rightText">` +
			unreceivedGovPayment1.toFixed(2) +
			`</td>
            <td class="rightText">` +
			unreceivedGovPayment2.toFixed(2) +
			`</td>
            <td class="rightText">` +
			unreceivedGovPayment.toFixed(2) +
			`</td>
        </tr>

        <tr>
            <th>Client contribution (Income tested fee)</th>
            <th class="rightText"> ` +
			expectedClientPayment1.toFixed(2) +
			`</th>
            <th class="rightText">` +
			expectedClientPayment2.toFixed(2) +
			`</th>
            <th class="rightText">` +
			expectedClientPayment.toFixed(2) +
			`</th>
        </tr>

        <tr>
            <td>+ Payment received (excl. transfer)</td>
            <td class="rightText">` +
			receivedClientPayment1.toFixed(2) +
			`</td>
            <td class="rightText">` +
			receivedClientPayment2.toFixed(2) +
			`</td>
            <td class="rightText">` +
			receivedClientPayment.toFixed(2) +
			`</td>
        </tr>

        <tr>
            <td>+ Payment NOT received</td>
            <td class="rightText"> ` +
			unreceivedClientPayment1.toFixed(2) +
			`</td>
            <td class="rightText"> ` +
			unreceivedClientPayment2.toFixed(2) +
			`</td>
            <td class="rightText">` +
			unreceivedClientPayment.toFixed(2) +
			`</td>
        </tr>`;

		content +=
			`<tr>
            <th>Transfers (received from previous Providers)</th>
            <th class="rightText">` +
			balance1.toFixed(2) +
			`</th>
            <th class="rightText">` +
			balance2.toFixed(2) +
			`</th>
            <th class="rightText">` +
			balance.toFixed(2) +
			`</th>
        </tr>

        <tr>
            <td>+ Government contribution portion</td>
            <td class="rightText">` +
			govPortion1.toFixed(2) +
			`</td>
            <td class="rightText">` +
			govPortion2.toFixed(2) +
			`</td>
            <td class="rightText">` +
			govPortion.toFixed(2) +
			`</td>
        </tr>
        <tr>
            <td>+ Client contribution portion</td>
            <td class="rightText">` +
			clientPortion1.toFixed(2) +
			`</td>
            <td class="rightText">` +
			clientPortion2.toFixed(2) +
			`</td>
            <td class="rightText">` +
			clientPortion.toFixed(2) +
			`</td>
        </tr>
        <tr>
            <th>TOTAL AMOUNT OF PACKAGE (inbound)</th>
            <th class="rightText">` +
			expectedTotal1.toFixed(2) +
			`</th>
            <th class="rightText">` +
			expectedTotal2.toFixed(2) +
			`</th>
            <th class="rightText">` +
			expectedTotal.toFixed(2) +
			`</th>
        </tr>`;

		content +=
			`<tr>
            <th class="smallTitle">OUTBOUND</th>
            <th></th>
            <th></th>
            <th></th>
        </tr>

        <tr>
            <td>Services & product spend (to date)</td>
            <td class="rightText">` +
			servicesExpenditure1.toFixed(2) +
			`</td>
            <td class="rightText">` +
			servicesExpenditure2.toFixed(2) +
			`</td>
            <td class="rightText">` +
			servicesExpenditure.toFixed(2) +
			`</td>

        </tr>

        <tr>
            <td>Package Management Fee***</td>
            <td class="rightText">` +
			(adminExpenditure1 + advisoryExpenditure1).toFixed(2) +
			`</td>
            <td class="rightText">` +
			(adminExpenditure2 + advisoryExpenditure2).toFixed(2) +
			`</td>
            <td class="rightText">` +
			(adminExpenditure + advisoryExpenditure).toFixed(2) +
			`</td>
        </tr>

        <tr>
            <td>Care Management Fee </td>
            <td class="rightText">0.00</td>
            <td class="rightText">0.00</td>
            <td class="rightText">0.00</td>
        </tr>

        <tr>
            <th>TOTAL AMOUNT OUT OF PACKAGE (outbound)
            </th>
            <th class="rightText">` +
			totalExpenditure1.toFixed(2) +
			`</th>
            <th class="rightText">` +
			totalExpenditure2.toFixed(2) +
			`</th>
            <th class="rightText">` +
			totalExpenditure.toFixed(2) +
			`</th>
        </tr>
        <tr>`;
		content +=
			`<tr>
            <th class="smallTitle">UNSPENT AMOUNT</th>
            <th class="rightText">` +
			(expectedTotal1 - totalExpenditure1).toFixed(2) +
			`</th>
            <th class="rightText">` +
			(expectedTotal2 - totalExpenditure2).toFixed(2) +
			`</th>
            <th class="rightText">` +
			(expectedTotal - totalExpenditure).toFixed(2) +
			`</th>
        </tr>
        </tbody>
        </table>
        <br><div style="page-break-after:always;"></div>`;
	} catch (err) {
		console.log(err);
	}
	// Adjustment Details
	if (record.AdjustmentDetails.length > 0) {
		content += `
    <table class="receipt w80">
    <thead class="receipt noBorder">
        <tr>
            <td colspan="3" height="50px"></td>
        </tr>
        <tr>
            <th colspan="2" >
            <img src="${filePath}/logo.png" width="180px" alt="logo">
            </th>
            <td colspan="1"><h2>Adjustment Details</h2>       
            <span> Client: </span><span class="bolder">${record.FullName}</span>
            <br> <br>  <span> Period: </span><span class="bolder">${record.Period}</span>
            </td>
         </tr>
         <tr>
         <td colspan="3" height="50px"></td>
         </tr>
    </thead>
    <tbody class="receipt withBorder">  
        <tr>
            <th class="w30">Adjustment Type</th>
            <th class="w20">Amount</th>
            <th class="w50">Description</th>

        </tr>`;
		record.AdjustmentDetails.forEach((element) => {
			content += ` 
            <tr>
                <td>${element['AdjustmentName']}</td>
                <td class="rightText">${element['Amount']}</td>
                <td >${element['Description']}</td>
            </tr>`;
		});
		content += `  
        </tbody>
        </table>
        <br><div style="page-break-after:always;"></div>`;
	}

	// Income Tested Fee Invoice
	if (record.IncomeTestedFeeSumaryData.length > 0) {
		content += `
        <table class="receipt w80">
        <thead class="receipt noBorder">
            <tr>
                <td colspan="5" height="50px"></td>
            </tr>
            <tr>
                <td colspan="2" class="w30">
                    <img src="${filePath}/logo.png" width="180px" alt="logo" >
                </td>
                <td colspan="3" rowspan="2"  class="w70">
                        <table class="receipt-header noBorder w100">
                        <tr><td colspan="2"><h2>TAX INVOICE</h2><td></tr>
                        <tr><td class="w30">Account No.:</td><td class="w70">${record.AccountNumber}</td></tr>
                        <tr><td class="w30">Invoice No.:</td><td class="w70">${record.AccountNumber.replace(/\s/g, '') +
							record.Period}</td></tr>
                        <tr><td class="w30">Date: </td><td class="w70 bolder">${formatDate(endPeriod)}</td></tr>
                        <tr><td class="w30">&nbsp;</td><td class="w70"></td></tr>
                        <tr><td class="w30 bolder">BILL TO:</td><td class="w70"></td></tr>
                        <tr><td class="w30">Client:</td><td class="w70 bolder">${record.FullName}</td></tr>
                        <tr><td class="w30">Address:</td><td class="w70">${record.AddressLine1}, ${record.AddressLine2}</td></tr>
                        </table>
                </td>
            </tr>

            <tr>
                <td colspan="2" >
                <span>ABN: 60 099 647 515</span><br>
                <br>
                <span>Suite 112</span><br>
                <span>Level 1</span><br>
                <span>40 Burgundy Street</span><br>
                <span>Heidelberg VIC 3084</span>      
                </td>
            </tr>

            <tr>
                    <td colspan="5" height="50px"></td>
            </tr>
        </thead>
       
        <tbody class="receipt withBorder">  
            <tr>
                <th class="w30 rightText">Number of days</th>
                <th class="w20 rightText">Unit Price</th>
                <th class="w50 rightText">Amount</th>
    
            </tr>`;
		let IncomeTestedFeeTotalAmount = 0;
		let IncomeTestedFeeAmount = 0;
		record.IncomeTestedFeeSumaryData.forEach((element) => {
			IncomeTestedFeeAmount = element['IncomeTestedFee'] * element['NumOfDays'];
			IncomeTestedFeeTotalAmount += tools.roundUp(IncomeTestedFeeAmount);

			content += ` 
                <tr>
                    <td class="rightText">${element['NumOfDays']}</td>
                    <td class="rightText">${element['IncomeTestedFee']}</td>
                    <td class="rightText">${IncomeTestedFeeAmount.toFixed(2)}</td>
                </tr>`;
		});
		content += ` 
            <tr><th colspan="2" class="bolder">TOTAL</th><th class="rightText">${IncomeTestedFeeTotalAmount.toFixed(
				2
			)}</th></tr> 
           
            </tbody>
            <tfoot class="receipt noBorder">
                <tr>
                <td colspan="3" height="150px"></td>
                </tr>
            </tfoot>
            </table>`;
		content += ` 
            <table class="receipt w80">
            <thead class="receipt noBorder">
            <tr>
                <td colspan="5" class="centerText"><span class="subTitle">&#9986;</span><span> ---------------Remittance Advice: Please retain the above portion for your records ---------------</span><hr></td>
            </tr>
            <tr>
            <td colspan="3" height="50px"></td>
            </tr>
            <tr>
                <td colspan="2" class="w50">
                
                </td>
                <td colspan="3" class="w50">
                        <table class="receipt-header noBorder w100">
                        <tr><td class="w30 noBorder">Terms: </td><td class="w70 bolder">Net 14 days</td></tr>
                        </table>
                </td>
            </tr>
            <tr>
                <td colspan="2" class="w50 centerText" height="20px" >
                <span>Account Name: Denmarlyn Pty Ltd</span><br>
                <span>BSB: 313 140</span><br>
                <span>Account No.: 120 14795</span>
                </td>

                <td colspan="3" class="w50">
                        <table class="receipt-header noBorder w100">
                        <tr><td class="w30">Account No.:</td><td class="w70">${record.AccountNumber}</td></tr>
                        <tr><td class="w30">Invoice No.:</td><td class="w70">${record.AccountNumber.replace(/\s/g, '') +
							record.Period}</td></tr>
                        <tr><td class="w30">Date: </td><td class="w70 bolder">${formatDate(endPeriod)}</td></tr>
                        <tr><td class="w30"></td><td class="w70"></td></tr>
                        <tr><td class="w30">Amount:</td><td class="w70 bolder">${IncomeTestedFeeTotalAmount.toFixed(
							2
						)}</td></tr>
                        </table>
                </td>
            </tr>
            </thead>
            </table>
            <br><div style="page-break-after:always;"></div>`;
	}

	// Care Service Details
	content += `
           <table class="receipt w80">
           <thead class="receipt noBorder">
                <tr>
                    <td colspan="6" height="50px"></td>
                </tr>
                <tr>
                    <th colspan="3">
                    <img src="${filePath}/logo.png" width="180px" alt="logo">
                    </th>
                    <td colspan="3" > 
                    <h2>Care Service Details</h2> 
                    <span> Client: </span><span class="bolder">${record.FullName}</span>
                    <br> <br> <span> Period: </span><span class="bolder">${record.Period}</span>                    
                    </td>
                 </tr>
                <tr>
                    <td colspan="6" height="50px"></td>
                </tr>
           </thead>
           <tbody class="receipt withBorder">
               <tr>
                   <th class="w25">Date of Services</th>
                   <th class="w5">Units</th>
                   <th class="w5">UoM</th>
                   <th class="w30">Description</th>
                   <th class="w15 rightText">Unit rate</th>
                   <th class="w20 rightText">Amount</th>
               </tr>`;
	// Sequel Home Care Services
	let total = 0;
	let subTotalHCS = 0;
	if (record.ServiceDetails.length > 0) {
		content += ` <tr class = "noBorder bolder" ><td colspan="6"> Sequel Home Care Services</td></tr>`;
		record.ServiceDetails.forEach((data) => {
			let DateOfService = tools.formatDateStyle2(data['Booking Date']);
			let Units = 0.0;
			let Description = '';
			let UnitRate = 0.0;
			let Amount = 0;
			let UoM = '';
			if (data['Hours Charged'] !== null && data['Hours Charged'] !== 0) {
				UoM = 'Hr';
				Units = data['Hours Charged'];
				Description = data['Task Name'] + ' ' + data['Task Prefix'];
				UnitRate = data['Charge Per Hour'];
				Amount = tools.roundUp(UnitRate * Units);
				content += ` <tr>
                        <td>${DateOfService}</td>
                        <td>${Units.toFixed(2)}</td>
                        <td>${UoM}</td>
                        <td>${Description}</td>
                        <td class="rightText">${UnitRate.toFixed(2)} </td>
                        <td class="rightText">${Amount.toFixed(2)}</td>
                        </tr>`;
				subTotalHCS += Amount;
			}

			if (data['Shifts Charged'] !== null && data['Shifts Charged'] !== 0) {
				UoM = 'Shifts';
				Units = data['Shifts Charged'];
				Description = data['Task Name'] + ' ' + data['Task Prefix'];
				UnitRate = data['Charge Per Shift'];
				Amount = tools.roundUp(UnitRate * Units);

				content += ` <tr>
                        <td>${DateOfService}</td>
                        <td>${Units.toFixed(2)}</td>
                        <td>${UoM}</td>
                        <td>${Description}</td>
                        <td class="rightText">${UnitRate.toFixed(2)} </td>
                        <td class="rightText">${Amount.toFixed(2)}</td>
                        </tr>`;
				subTotalHCS += Amount;
			}

			if (data['KMs Charged'] !== null && data['KMs Charged'] !== 0) {
				UoM = 'Km';
				Units = data['KMs Charged'];
				Description = 'Travel';
				UnitRate = data['Charge Per KM'];
				Amount = tools.roundUp(UnitRate * Units);

				content += ` <tr>
                        <td>${DateOfService}</td>
                        <td>${Units.toFixed(2)}</td>
                        <td>${UoM}</td>
                        <td>${Description}</td>
                        <td class="rightText">${UnitRate.toFixed(2)} </td>
                        <td class="rightText">${Amount.toFixed(2)}</td>
                        </tr>`;
				subTotalHCS += Amount;
			}
		});

		// Display Sub-Total
		content += `<tr> <td colspan="5"> SUB-TOTAL </td> <td class="rightText bolder"> ${subTotalHCS.toFixed(
			2
		)} </td> </tr>`;
	}
	// Third Party
	let subTotal3PT = 0;
	if (record.ThirdPartyServiceDetails.length > 0) {
		content += ` <tr class = "noBorder bolder" ><td colspan="6">Third Party Services</td></tr>`;
		record.ThirdPartyServiceDetails.forEach((element) => {
			content += ` <tr>
            <td>${tools.formatDateStyle2(element['InvoiceDate'])}</td>
            <td>${element['Unit']}</td>
            <td>N/A</td>
            <td>${element['SupplierName']}${element['ServiceDescription'] !== ''
				? '(' + element['ServiceDescription'] + ')'
				: ''}</td>
            <td class="rightText">${element['Amount'].toFixed(2)} </td>
            <td class="rightText">${element['Amount'].toFixed(2)}</td>
            </tr>`;
			subTotal3PT += element['Amount'];
		});

		// Display Sub-Total
		content += `<tr> <td colspan="5"> SUB-TOTAL </td> <td class="rightText bolder"> ${subTotal3PT.toFixed(
			2
		)} </td> </tr>`;
	}

	// Display Total
	total = subTotal3PT + subTotalHCS;
	content += `<tr> <th colspan="5"> TOTAL </th> <td class="rightText bolder"> ${total.toFixed(2)} </td> </tr> 
        </tbody>
       </table>
       <br><div style="page-break-after:always;"></div>`;

	// Leave Balance
	content += `
    <table class="receipt w80">
    <thead class="receipt noBorder">
        <tr>
            <td colspan="4" height="50px"></td>
        </tr>
        <tr>
            <th colspan="2"style="width:100%" >
            <img src="${filePath}/logo.png" width="180px" alt="logo">
            </th>
            <td colspan="2" >
              <h2>Leave Balance</h2>
              <span> Client: </span><span class="bolder">${record.FullName}</span>
              <br> <br> <span> Period: </span><span class="bolder">${record.Period}</span>
            </td>
        </tr>
        <tr>
            <td colspan="4" height="50px"></td>
        </tr>
        <tr>
            <td colspan="4" > <h2>Leave Balance Summary</h2> </td>
        </tr>
    </thead>
    <tbody class="receipt withBorder">
       
        <tr>
            <th class="w25">Leave types</th>
            <th class="w18-75">Leave Entitlement</th>
            <th class="w18-75">Leave Taken <span class="smallText">(Accumulated to date)</span></th>
            <th class="w18-75">Leave Taken <span class="smallText">(This Period)</span></th>
            <th class="w18-75">Leave Remain</th>
            
        </tr>`;
	let i = 0;
	record.LeaveSumaryData.forEach((element) => {
		let previousData =
			record.LeaveSumaryPreviousPeriod != null
				? record.LeaveSumaryPreviousPeriod.filter((item) => item.LeaveTypeID == element.LeaveTypeID[0])
				: null;
		let thisPreviousData =
			record.LeaveSumaryThisPeriod != null
				? record.LeaveSumaryThisPeriod.filter((item) => item.LeaveTypeID == element.LeaveTypeID[0])
				: null;
		let previousLeaveTaken =
			previousData != null ? (previousData.length != 0 ? previousData[0]['LeaveTaken'] : 0) : 0;
		let leaveTaken =
			thisPreviousData != null ? (thisPreviousData.length != 0 ? thisPreviousData[0]['LeaveTaken'] : 0) : 0;
		let leaveQuota =
			element['LeaveCalcModeCode'] === 'CON'
				? element['LeaveQuota'] + ' <span class="smallText">(Next episode)</span>'
				: element['LeaveQuota'] - previousLeaveTaken - leaveTaken;
		content += ` <tr>
            <td>${element['LeaveTypeName']}</td>
            <td>${element['LeaveQuota']}&nbsp<span class="smallText">(${element['LeaveCalcModeName']})</span></td>
            <td class="rightText">${previousLeaveTaken + leaveTaken}</td>
            <td class="rightText">${leaveTaken}</td>
            <td >${leaveQuota}</td>
            </tr>`;
		i++;
	});
	content += `  
           </tbody>
           </table>`;

	content += `
           <table class="receipt w80">
           <thead class="receipt noBorder">
                <tr>
                    <td colspan="4" > <h2>Leave Details</h2> </td>
                </tr>
           </thead>
           <tbody class="receipt withBorder">
               <tr>
                   <th class="w25">Start Date</th>
                   <th class="w25">End Date</th>
                   <th class="w25">Leave Taken</th>
                   <th class="w25">Leave Type</th>
               </tr>`;
	record.LeaveDetails.forEach((element) => {
		content += ` <tr>
                   <td>${tools.formatDateStyle2(element['CurrentStartDate'])}</td>
                   <td>${tools.formatDateStyle2(element['CurrentEndDate'])}</td>
                   <td class="rightText">${element['CurrentLeaveTaken']}</td>
                   <td>${element['LeaveTypeName']}</td>
       
                   </tr>`;
	});
	content += `  
                  </tbody>
                  </table>`;

	content += `
            </section>
            </body>
            </html>`;

	return content;
}
module.exports.summayStatement = summayStatement;

function formatDate(date) {
	let arr = date.split('-');
	let dateStr = [ arr[2], arr[1], arr[0] ].join('/'); /* DD/MM/YYYY */
	return dateStr;
}
