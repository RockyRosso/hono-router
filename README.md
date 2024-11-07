# hono-router
A file based router for the backend javascript framework, Hono 

# Instalation
```
git clone https://github.com/RockyRosso/hono-router

npm install -g pnpm ## Only do this if you don't have pnpm installed

pnpm install
```
# Guide
All routes must be stored in the `routes/` folder which is located in the `src/` folder.
When creating a route, it can be named in two ways:

- `routename.ts` ## Will allow any fetching method
- `routename.method.ts` ## Will assign a specific fetching method. Any other method used will throw an error

If you choose to put the `server.ts` file anywhere outside of the `src/` folder, remember that the `routes/` folder must **ALWAYS** be in the same directory as the `server.ts` file. 

You can of course modify this behavior if you choose to do so.
