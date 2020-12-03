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
        this.inspect()
    }

    inspect() {
        let inspection = spawnModule.spawn('docker', ['container', 'inspect', this.config.name])
        inspection.on('exit', (code) => {
            if(code === 0 ) {
                console.log(inspection.stdout.read())
            } else {
                console.error(this.config.name, " is dead")
            }
        })
    }

    OutHandler(data: string) {
        this.outCallStack.forEach(call => call(data));
    }
}