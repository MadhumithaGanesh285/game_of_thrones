// server.js (or proxyServer.js)

import express from "express";
import corsAnywhere from "cors-anywhere";

const app = express();
const port = 5000;

// Create the CORS proxy server
corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
}).listen(port, () => {
  console.log(`CORS Anywhere proxy server running at http://localhost:${port}`);
});