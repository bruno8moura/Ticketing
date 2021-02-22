import express from 'express';
import { index } from '../controllers/OrdersController';

const routes = express.Router();

routes.get('/', index);

export default routes;