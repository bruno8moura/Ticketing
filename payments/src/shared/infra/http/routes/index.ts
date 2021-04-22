import { Router } from 'express';
import paymentsRoutes from '../../../../modules/payments/infra/http/routes/payments.routes';

const routes = Router();

routes.use('/api/payments', paymentsRoutes);

export default routes;