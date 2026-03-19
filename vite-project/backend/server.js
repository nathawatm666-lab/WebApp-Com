const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cors = require('cors');

// Enable CORS for all routes
server.use(cors());
server.use(middlewares);
server.use(router);

// Get the port from the environment variable (Render sets this) or use 3001
const port = process.env.PORT || 3001;

server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`);
});
