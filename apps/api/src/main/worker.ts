import { startWorkers } from "@/infrastructure/queue/workers";
import bullBoardRoutes from '../infrastructure/http/express/routes/bull-board.routes';
import app from "./app";

startWorkers();

app.use(bullBoardRoutes);
