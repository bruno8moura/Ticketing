import { Router } from 'express';
import ordersRoutes from '../../../../modules/orders/infra/http/routes/orders.routes';

const routes = Router();

routes.use('/api/orders', ordersRoutes);

export default routes;



