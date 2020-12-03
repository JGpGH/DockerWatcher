import spawnModule from "child_process"
import { ContainerConfig } from "./config/config"
export default class Watcher {
    logsProcess: spawnModule.ChildProcessWithoutNullStreams;
    info: any;
    outCallStack: Function[] = [];

    constructor(private config: ContainerConfig) {
        this.logsProcess = spawnModule.spawn('docker', ['logs', '--follow', this.config.name]);
        if(config.verbose) {
            this.outCallStack.push(function(data: string){console.log(`${config.name}: ${data}`)});
        }
        this.logsProcess.stdout.on('data', this.OutHandler.bind(this));
        this.logsProcess.stderr.on('data', this.OutHandler.bind(this));
        setInterval(()=> {
            this.inspect();
            this.checkRunningStatus();
        }, this.config.refreshTime || 1000);
    }

    checkRunningStatus() {
        if(this.info["State"]["Status"] !== "running") {
            if(this.config.onExit) {
                spawnModule.exec(this.config.onExit)
            }
            if(this.config.verbose) {
                console.log(this.config.name, " has ended")
            }
        }
    }

    inspect() {
        let inspection = spawnModule.exec(`docker container inspect ${this.config.name}`,
        (error, stdout, stderr)=> {
            if(inspection.exitCode === 0) {
                this.info = JSON.parse(stdout)
            } else {
                console.error('no such container ', this.config.name)
            }
        })
    }

    OutHandler(data: string) {
        this.outCallStack.forEach(call => call(data));
    }
}