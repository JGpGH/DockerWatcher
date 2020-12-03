import spawnModule from "child_process"
import fs from "fs";
import { ContainerConfig } from "./config/config"
import path from "path"

export default class Watcher {
    logsProcess: spawnModule.ChildProcessWithoutNullStreams;
    info: any;
    outCallStack: Function[] = [];
    inspectionProcess: any;

    constructor(private config: ContainerConfig) {
        this.logsProcess = spawnModule.spawn('docker', ['logs', '--follow', this.config.name]);
        if(config.verbose) {
            this.outCallStack.push(function(data: string){console.log(`${config.name}: ${data}`)});
        }
        if(config.log !== false) {
            if(!config.logFileDir) {
                config.logFileDir = '.'
            }
            this.outCallStack.push(this.writeToLogFile.bind(this))
        }
        this.logsProcess.stdout.on('data', this.OutHandler.bind(this));
        this.logsProcess.stderr.on('data', this.OutHandler.bind(this));
        this.inspectionProcess = setInterval(()=> {
            this.inspect().then(() => {
                this.checkRunningStatus();
            })
        }, this.config.refreshTime || 1000);
    }

    writeToLogFile(data: string) {
        const currentDate = new Date();
        const fileName = `${this.config.name}-${currentDate.getMonth()}-${currentDate.getDate()}`
        const fpath = path.join(this.config.logFileDir || ".", fileName)
        fs.stat(fpath, (err, stats) => {
            if(stats.isFile()) {
                fs.appendFile(fpath, data, (err) => {if(err)console.error(err)})
            } else {
                fs.writeFile(fpath, data, (err)=> {if(err)console.error(err)})
            }
        })
    }

    checkRunningStatus() {
        if(this.info["State"]["Status"] !== "running") {
            if(this.config.onExit) {
                spawnModule.exec(this.config.onExit)
            }
            if(this.config.verbose) {
                console.log(this.config.name, " is innactive !");
            }
        }
    }

    inspect(): Promise<null> {
        return new Promise((done, err) => {
            let inspection = spawnModule.exec(`docker container inspect ${this.config.name}`,
            (error, stdout, stderr)=> {
                if(inspection.exitCode === 0) {
                    this.info = JSON.parse(stdout)[0]
                    done(null);
                } else {
                    console.error('container ', this.config.name, ' not active')
                }
            })
        })
    }

    OutHandler(data: string) {
        this.outCallStack.forEach(call => call(data));
    }
}