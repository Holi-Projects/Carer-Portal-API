function exitReport(data) {
	console.log('exitReport(data) - exitReportTemplate.js');
	let currentDir = __dirname.replace(/\\/g, '/');
	let filePath = 'file:///' + currentDir;
	console.log('summayStatement-template-filePath:' + filePath);
	const tools = require('../utils/tools.js');

	// if (this.state.data!==null && this.state.data !==404){
	// let data = record;
	// console.log(record);
	let receivedGovernmentSubsidy = data.ReceivedGovernmentContribution;
	let unreceivedGovernmentSubsidy = data.GovernmentContribution - data.ReceivedGovernmentContribution;
	let governmentSubsidy = data.GovernmentContribution;
	let receivedClientContribution = data.ReceivedClientContribution;
	let unreceivedClientContribution = data.ClientContribution - data.ReceivedClientContribution;
	let clientContribution = data.ClientContribution;
	let serviceFee = data.ProductServiceExpenditure;
	let adminFee = data.AdministrativeFee;
	let advistoryFee = data.CoreAdvisoryFee;
	let initialTransfer = data.InitialTransfer + data.ClientTransferAdjust + data.GovTransferAdjust;
	let initialClientTransfer = data.InitialClientTransfer + data.ClientTransferAdjust;
	let initialGovTransfer = data.InitialGovTransfer + data.GovTransferAdjust;
	let startDate = data.ServiceStartDate !== null ? formatDate(data.ServiceStartDate.substring(0, 10)) : 'N/A';
	let endDate = data.ServiceFinishDate !== null ? formatDate(data.ServiceFinishDate.substring(0, 10)) : 'N/A';
	let fullName = data.FirstName + ' ' + data.LastName;

	// }
	let totalInbound = data.TotalFunding + initialTransfer;
	let totalOutbound = data.TotalExpenditure;
	// let exitFee = data.ExitFee;
	// let unspendAmount = totalInbound - totalOutbound;
	// let totalGovPortionReceived = governmentSubsidy + initialGovTransfer;
	// let totalClientPortionReceived = receivedClientContribution + initialClientTransfer;
	// let totalAmountReceived = totalGovPortionReceived + totalClientPortionReceived;
	// let govPortionReceivedPercentage =totalGovPortionReceived*100/totalAmountReceived;
	// let clientPortionReceivedPercentage = 100 - govPortionReceivedPercentage;
	// let unspendAmountAdjust = unspendAmount - data.ExitFee;
	// let govPortionTransfer = unspendAmountAdjust * govPortionReceivedPercentage/100;
	// let clientPortionTransfer = unspendAmountAdjust * clientPortionReceivedPercentage/100-unreceivedClientContribution;
	// let totalTransfer = govPortionTransfer + clientPortionTransfer;

	let unspendAmount = totalInbound - totalOutbound;
	let totalGovPortionReceived = governmentSubsidy + initialGovTransfer;
	let totalClientPortionReceived = clientContribution + initialClientTransfer;
	let totalAmountReceived = totalGovPortionReceived + totalClientPortionReceived;
	let govPortionReceivedPercentage = (totalGovPortionReceived / totalAmountReceived).toFixed(4);
	let clientPortionReceivedPercentage = (1 - govPortionReceivedPercentage).toFixed(4);
	let unspendAmountAdjust = unspendAmount - data.ExitFee;
	let govPortionTransfer = unspendAmountAdjust * govPortionReceivedPercentage;
	let clientPortionTransfer = unspendAmountAdjust * clientPortionReceivedPercentage - unreceivedClientContribution;
	let totalTransfer = govPortionTransfer + clientPortionTransfer;

	content = `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>Exit Report Template</title>
          <link id='stylecss' type="text/css" rel="stylesheet" href="${filePath}/index.css">
          
       </head>
       <body>
       <section class="receipt">`;

	content += `
       <table class="receipt w80" cellpadding="0">
       <thead class="receipt noBorder">
           <tr>
               <td colspan="4" height="50px"></td>
           </tr>
           <tr>
               <th colspan="1" >
               <img src="${filePath}/logo.png" width="180px" alt="logo">
               </th>
               <td colspan="3"><h2>Home Care Package TRANSFER REPORT</h2>       
               <span> Client: </span><span class="bolder">${fullName}</span>
               <br> <br>  <span> Period: </span><span class="bolder">(${startDate} -> ${endDate})</span>
               </td>
            </tr>
            <tr>
            <td colspan="4" height="50px"></td>
            </tr>
       </thead>`;

	content += `<tbody class="receipt withBorder">
                <tr>
                    <th class="w40 smallTitle greyBg" colSpan="4">INBOUND</th>
                </tr>

                <tr>
                    <th class="w40" >Government contribution (excl. transfer)</th>
                    <th class="rightText" colSpan="3" class="w60">${governmentSubsidy.toFixed(2)}</th>
                </tr>

                <tr>
                    <td>+ Payment received (excl. transfer)</td>
                    <td class="rightText" colSpan="3">${receivedGovernmentSubsidy.toFixed(2)}</td>

                </tr>

                <tr>
                    <td>+ Payment NOT received</td>
                    <td class="rightText" colSpan="3">${unreceivedGovernmentSubsidy.toFixed(2)}</td>
                </tr>

                <tr>
                    <th>Client contribution (Income tested fee)</th>
                    <th class="rightText" colSpan="3">${clientContribution.toFixed(2)}</th>

                </tr>

                <tr>
                    <td>+ Payment received (excl. transfer)</td>
                    <td class="rightText" colSpan="3">${receivedClientContribution.toFixed(2)} </td>

                </tr>

                <tr>
                    <td>+ Payment NOT received</td>
                    <td class="rightText" colSpan="3">${unreceivedClientContribution.toFixed(2)} </td>

                </tr>

                <tr>
                    <th>Transfers (received from previous Providers - if applicable)</th>
                    <th class="rightText" colSpan="3">${initialTransfer.toFixed(2)}</th>
                </tr>

                <tr>
                    <td>+ Government contribution portion</td>
                    <td class="rightText" colSpan="3">${initialGovTransfer.toFixed(2)}</td>

                </tr>

                <tr>
                    <td>+ Client contribution portion</td>
                    <td class="rightText" colSpan="3">${initialClientTransfer.toFixed(2)} </td>
                </tr>

                <tr>
                    <th>TOTAL AMOUNT (inbound)</th>
                    <th class="rightText" colSpan="3">${totalInbound.toFixed(2)}</th>
                </tr>

                <tr>
                    <th class="smallTitle greyBg" colSpan="4">OUTBOUND</th>
                </tr>

                <tr>
                    <td >Services &amp; product spend</td>
                    <td class="rightText" colSpan="3">${serviceFee.toFixed(2)} </td>

                </tr>

                <tr>
                    <td>Package management fee</td>
                    <td class="rightText" colSpan="3">${(adminFee + advistoryFee).toFixed(2)} </td>

                </tr>

                <tr>
                    <td>Care management fee</td>
                    <td class="rightText" colSpan="3">0.00</td>

                </tr>

                <tr>
                    <th>TOTAL AMOUNT (outbound)</th>
                    <th class="rightText" colSpan="3">${totalOutbound.toFixed(2)}</th>
                </tr>


                <tr>
                    <th class="smallTitle greyBg" colSpan="4">TRANSFER</th>
                </tr>

                <tr>
                    <td>UNSPENT HOME CARE AMOUNT</td>
                    <td colSpan="2"></td>
                    <td class="rightText" >${unspendAmount.toFixed(2)} </td>

                </tr>

                <tr>
                    <td>less Exit fee</td>
                    <td colSpan="2"></td>
                    <td class="rightText" >
                    ${data.ExitFee.toFixed(2)}
                    </td>

                </tr>

                <tr>
                    <td>UNSPENT HOME CARE AMOUNT ADJUSTED</td>
                    <td colSpan="2"></td>
                    <td class="rightText" >${unspendAmountAdjust.toFixed(2)} </td>
                </tr>
                <tr>
                    <th class="smallTitle greyBg" colSpan="4"></th>
                </tr>

                <tr>
                    <td>PORTION OF GOVERNMENT CONTRIBUTION</td>
                    <td class="rightText" >${totalGovPortionReceived.toFixed(2)}</td>
                    <td class="rightText" >${(Number(govPortionReceivedPercentage) * 100).toFixed(2)}%</td>
                    <td class="rightText" >${govPortionTransfer.toFixed(2)}</td>
                </tr>


                <tr>
                    <td>PORTION OF CLIENT CONTRIBUTION</td>
                    <td class="rightText" >${totalClientPortionReceived.toFixed(2)}</td>
                    <td class="rightText" >${(Number(clientPortionReceivedPercentage) * 100).toFixed(2)}%</td>
                    <td class="rightText" >${clientPortionTransfer.toFixed(2)}</td>
                </tr>

                <tr>
                    <th>TOTAL TRANSFER AMOUNT</th>
                    <th class="rightText">${totalAmountReceived.toFixed(2)}</th>
                    <th class="rightText"></th>
                    <th class="rightText">${totalTransfer.toFixed(2)}</th>
                </tr>

            </tbody>
            </table>`;

	content += `
            </section>
            </body>
            </html>`;

	return content;
}
module.exports.exitReport = exitReport;

function formatDate(date) {
	let arr = date.split('-');
	let dateStr = [ arr[2], arr[1], arr[0] ].join('/'); /* DD/MM/YYYY */
	return dateStr;
}
