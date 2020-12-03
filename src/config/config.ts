export interface ContainerConfig {
    name: string;
    onExit?: string;
    verbose?: boolean
}
export interface Config {
    containers: ContainerConfig[];
}