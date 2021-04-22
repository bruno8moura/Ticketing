import { OrderCancelledListener } from '../../../events/listeners/OrderCancelledListener';
import OrderCreatedListener from '../../../events/listeners/OrderCreatedListener';
import { natsWrapper } from '../clients/NATSStreamServer/NATSWrapper';

export const listenEvents = async () => {
    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();
}