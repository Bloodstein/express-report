const express = require('express');
const app = express();
const logger = require('./report-logger').logger;
const BASIC_URL = 'http://prod.pyramid/api/report/express/';

app.get('/reports', (req, res) => {
    res.send({"Error": true, "Message": "GET Запрос недоступен для данного URL адреса."});
});

app.post('/reports', (req, res) => {
    try {
        initialLog(req);
        let runner = require("./ExcelCreator");
        runner.execute(req.query, BASIC_URL+req.query.reportUrl);
        console.log("Report generation has started");
        res.send({"Error": false, "Message": "Запрос на формирование отчёта принят. Ожидайте файл в блоке 'Мои отчёты'"});
    }
    catch (e) {
        console.log(e);
        res.send({"Error": true, "Message": e.toString()});
    }
});

app.listen(3002);


function initialLog(req) {
    logger.write("-------------------");
    logger.write("Request:");
    logger.write("--------");
    logger.writeObject(req.query);
    logger.write("--------");
    logger.write("End request");
    logger.write("-------------------");
}