import express from 'express';
import { index, del, show, create } from '../controllers/OrdersController';

const routes = express.Router();

routes.post('/', create);
routes.get('/', index);
routes.get('/:orderId', show);
routes.delete('/:orderId', del);

export default routes;