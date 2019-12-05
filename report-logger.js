const fs = require('fs');

class Logger {
    constructor(props) {
        this.filename = props.filename;
        if(!fs.existsSync(this.filename)) {
            fs.writeFileSync(this.filename, "REPORT LOGGER STARTED");
        }
        this.weekDays = {
            1: "Понедельник",
            2: "Вторник",
            3: "Среда",
            4: "Четверг",
            5: "Пятница",
            6: "Суббота",
            7: "Воскресенье"
        };
    }

    write(text) {
        let fileContent = fs.readFileSync(this.filename);
        text = this.getDate()+text;
        fs.writeFileSync(this.filename, fileContent+"\r\n"+text);
    }

    getDate() {
        let d = new Date();
        return d.getHours()
            +":"
            +(d.getMinutes().toString().length == 1 ? "0"+d.getMinutes() : d.getMinutes())
            +" "
            +d.getDate()
            +"."
            +d.getMonth()
            +"."
            +d.getFullYear()
            +" "
            +this.weekDays[d.getDay()]
            +" [INFO]:";
    }

    writeObject(object) {
        for(let prop in object) {
            if(typeof object[prop] == "object") {
                this.write(" "+prop+":");
                for(let subProp in object[prop]) {
                    this.write("    "+subProp+": "+object[prop][subProp]);
                }
            } else {
                this.write(" "+prop+": "+object[prop]);
            }
        }
    }
}
let logger = new Logger({
    filename: "./report_logger.log"
});

module.exports = {
    "logger": logger,
}