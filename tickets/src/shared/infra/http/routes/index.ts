import { Router } from 'express';
import ticketsRoutes from '../../../../modules/ticket/infra/http/routes/tickets.routes';

const routes = Router();

routes.use('/api/tickets', ticketsRoutes);

export default routes;



