import OrderCreatedListener from '../../../../events/listeners/OrderCreatedListener';
import { natsWrapper } from '../../../clients/NATSStreamServer/NATSWrapper';
export default () => {
    new OrderCreatedListener(natsWrapper.client).listen();    
}