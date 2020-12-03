import spawnModule from "child_process"
import { ContainerConfig } from "./config/config"
export default class Watcher {
    process: spawnModule.ChildProcessWithoutNullStreams;
    outCallStack: Function[] = [];

    constructor(private config: ContainerConfig) {
        this.process = spawnModule.spawn('docker', ['logs', '--follow', this.config.name]);
        if(config.verbose) {
            this.outCallStack.push(function(data: string){console.log(`${config.name}: ${data}`)});
        }
        this.process.stdout.on('data', this.OutHandler);
        this.process.stderr.on('data', this.OutHandler);
    }

    OutHandler(data: string) {
        this.outCallStack.forEach(call => call(data));
    }
}