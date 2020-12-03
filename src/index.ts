import express from "express"
import path from "path"
import fs from "fs"
import {ContainerConfig, Config} from "./config/config"
import Watcher from "./watcher"

let containers: Watcher[] = []

const app = express()
const configFilePath = path.join(__dirname, "config", "config.json")

let config = {} as Config
config = JSON.parse(fs.readFileSync(configFilePath).toString());

config.containers.forEach((container) => {
    containers.push(new Watcher(container));
})