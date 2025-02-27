// server.js (or proxyServer.js)

import express from "express";
import corsAnywhere from "cors-anywhere";

const app = express();
const port = 5000; // You can choose any port you prefer

// Create the CORS proxy server
corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins (you can restrict this if needed)
}).listen(port, () => {
  console.log(`CORS Anywhere proxy server running at http://localhost:${port}`);
});