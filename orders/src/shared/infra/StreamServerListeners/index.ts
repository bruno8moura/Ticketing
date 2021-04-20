import ExpirationCompleteListener from '../../../events/listeners/ExpirationCompleteListener';
import TicketCreatedListener from '../../../events/listeners/TicketCreatedListener';
import TicketUpdatedListener from '../../../events/listeners/TicketUpdatedListener';

import { natsWrapper } from '../clients/NATSStreamServer/NATSWrapper';

export const listenEvents = async () => {
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
};
