export interface ContainerConfig {
    name: string;
    onExit?: string;
    verbose?: boolean;
    refreshTime?:number;
    log?:boolean;
    logFileDir?: string;
}
export interface Config {
    containers: ContainerConfig[];
}