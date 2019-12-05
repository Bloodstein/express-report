const fetch = require('node-fetch');
const XLSX = require('exceljs');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const reportUploader = "http://prod.pyramid/api/report/express/uploadreportfile";

let reportName = null;

module.exports = {
    "execute": (payload, url) => {
        let query = "?"
            + Object.keys(payload.params)
                .map((key) => encodeURIComponent(key.toString())+"="+encodeURIComponent(payload.params[key]))
                .join("&");
        reportName = payload.reportName;
        fetch(url+query, { method: "GET" })
            .then(response => response.json())
            .then(data => CreateExcel(data))
            .catch(e => console.log(e));
    },
};

function CreateExcel(data)
{
    let wb = new XLSX.Workbook();
    let fileName = "./reports/"+new Date().getTime()+"_report.xlsx";
    let sheet = wb.addWorksheet('Отчет', {
        properties:{
            tabColor:{
                argb:'FFC0000'
            },
            pageSetup:{
                paperSize: 9, orientation:'landscape'
            }
        }
    });

    sheet.views = [
        {
            state: 'frozen',
            ySplit: 1,
            topLeftCell: 'G10',
            activeCell: 'A1'
        }
    ];

    sheet.autoFilter = 'A1:AZ1';

    sheet.columns = data.columns;

    data.items.forEach((value, key) => {
        console.log(key);
        sheet.addRow(value);
    });

    wb.xlsx.writeFile(fileName)
        .then(() => SendReportFile(fileName));
    console.log("Excel has created");
}

function SendReportFile(fileName) {
    let fd = new FormData();
    let file = fs.readFileSync(fileName);
    fd.append('reportName', reportName);
    fd.append('reportFile', file, "temp.xlsx");
    fetch(reportUploader,
        {
        method: "POST",
        body: fd,
        }
    )
        .then(res => res)
        .then(data => console.log(data))
        .catch(e => console.log(e));
}