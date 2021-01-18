import { Router } from 'express';
import ticketsRoutes from '../../../../modules/tickets/infra/http/routes/tickets.routes';

const routes = Router();

routes.use('/api/tickets', ticketsRoutes);

export default routes;



