// for connection routing
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { acceptConnectionRequest, getConnectionRequests, getConnections, getConnectionStatus, rejectConnectionRequest, removeConnection, sendConnectionRequest } from "../controllers/connection.controller.js";

// create the router
const connectionRouter = express.Router();

// routes for connections are:
// send connection request
connectionRouter.post('/request/:userId', protectRoute, sendConnectionRequest);

// accept connection request
connectionRouter.put('/accept/:requestId', protectRoute, acceptConnectionRequest);

// reject connection request
connectionRouter.put('/reject/:requestId', protectRoute, rejectConnectionRequest);

// get all connection requests
connectionRouter.get('/requests', protectRoute, getConnectionRequests);

// get all connections
connectionRouter.get('/', protectRoute, getConnections);

// remove a connection
connectionRouter.delete('/:userId', protectRoute, removeConnection);

// get connection status
connectionRouter.get('/status/:userId', protectRoute, getConnectionStatus);


// export the router
export default connectionRouter