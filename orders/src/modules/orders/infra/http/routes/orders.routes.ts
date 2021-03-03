import express from 'express';
import { index, del, show, create, createOrderValidations } from '../controllers/OrdersController';
import { requestValidation, auth } from '@bcmtickets/common';

const routes = express.Router();

routes.post('/', auth, createOrderValidations, requestValidation, create);
routes.get('/', index);
routes.get('/:orderId', show);
routes.delete('/:orderId', del);

export default routes;