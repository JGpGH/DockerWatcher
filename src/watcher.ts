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
        let inspection = spawnModule.exec(`docker container inspect ${this.config.name}`,
        (error, stdout, stderr)=> {
            console.log(stdout);
        })
    }

    OutHandler(data: string) {
        this.outCallStack.forEach(call => call(data));
    }
}