//-- Variables

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

//--

//-- Functions

function createUrlRoute(route: string) {
    let routeNames = route.split("/");
    const routeFileName = routeNames[routeNames.length - 1];

    const splitFileName = routeFileName.split(".");

    const routeMethod = splitFileName[splitFileName.length - 2];
    const routeName = splitFileName[0];

    routeNames[routeNames.length - 1] = routeName;
    let urlRoute: string = routeNames.join("/");
    urlRoute = urlRoute.replace("index", "");

    return [ urlRoute, routeMethod ];
}

//--

export default class Server {
    port: number;

    private app: Hono;
    private routeFilePath: string;

    private routes: string[];

    constructor(port: number) {
        this.port = port;
        this.app = new Hono();

        this.routes = [];
        
        this.routeFilePath = `${path.dirname(fileURLToPath(import.meta.url))}/routes`;
    }

    async init() {
        await this.initRoutes();
  
        console.log(`Server is running on http://localhost:${this.port}`);

        serve({
            fetch: this.app.fetch,
            port: this.port,
        });
    }

    async initRoutes() {
        await this.searchRoutes();
        await this.createRoutes();
    }

    private async createRoutes() {
        for (let i = 0; i < this.routes.length; i++) {
            const route = this.routes[i].split(this.routeFilePath)[1];

            const [ urlRoute, routeMethod ] = createUrlRoute(route);

            await this.createRouteMethods(urlRoute, routeMethod, this.routes[i]);
        }
    }

    private async searchRoutes(path?: string) {
        const pathString = path ? path : this.routeFilePath;

        const fsPath = fs.readdirSync(pathString, { withFileTypes: true });

        for (const file of fsPath) {
            if (file.isDirectory()) {
                await this.searchRoutes(file.parentPath + "/" + file.name);
            }

            if (file.name.endsWith(".js") || file.name.endsWith(".ts")) {
                this.routes.push(file.parentPath + "/" + file.name);
            }
        }
    }

    private async createRouteMethods(urlRoute: string, routeMethod: string, fileRoute: string) {
        const routeFile = await import(fileRoute);

        if (typeof routeFile.default === "object") return;

        switch (routeMethod) {
            case "post":
                this.app.post(urlRoute, routeFile.default);

            case "get":
                this.app.get(urlRoute, routeFile.default);

            case "put":
                this.app.put(urlRoute, routeFile.default);

            case "delete":
                this.app.delete(urlRoute, routeFile.default);

            case "patch":
                this.app.patch(urlRoute, routeFile.default);

            default:
                this.app.all(urlRoute, routeFile.default);
        }
    }
}
