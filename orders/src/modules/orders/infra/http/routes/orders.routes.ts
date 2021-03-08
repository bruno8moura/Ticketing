import express from 'express';
import { index, del, show, create, createOrderValidations, deleteOrderValidations } from '../controllers/OrdersController';
import { requestValidation, auth } from '@bcmtickets/common';

const routes = express.Router();

routes.post('/', auth, createOrderValidations, requestValidation, create);
routes.get('/', auth, index);
routes.get('/:orderId', auth, show);
routes.delete('/:orderId', auth, deleteOrderValidations, del);

export default routes;