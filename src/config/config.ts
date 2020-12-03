export interface ContainerConfig {
    name: string;
    onExit?: string;
    verbose?: boolean;
    refreshTime?:number;
}
export interface Config {
    containers: ContainerConfig[];
}