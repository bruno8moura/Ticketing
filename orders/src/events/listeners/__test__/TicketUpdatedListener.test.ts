import { TicketUpdatedEvent } from '@bcmtickets/common';
import { Mongoose } from 'mongoose';
import { natsWrapper } from '../../../shared/infra/clients/NATSStreamServer/NATSWrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../modules/orders/infra/mongoose/entities/Ticket';
import TicketUpdatedListener from '../TicketUpdatedListener';

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save ticket
    const ticket = Ticket.build({        
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert', 
        price: 20,
    });

    await ticket.save();

    // create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id!,
        title: 'new concert', 
        price: 999,
        userId: new mongoose.Types.ObjectId().toHexString(), // doesn't matter...
    }

    // create a fake message object
    // Tells to typescript I know what I'm doing.
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, ticket };
};

describe('Test when updating a ticket throught the stream server listener', () => {
    it('finds, updates and saves a ticket', async () => {
        const { data, listener, msg, ticket } = await setup();

        // call the onMessage function with the data object + message object
        await listener.onMessage( data, msg );
        const updatedTicket = await Ticket.findById(ticket.id);

        // write assertions to make sure a ticket was updated!
        expect(updatedTicket!.title).toEqual(data.title);
        expect(updatedTicket!.price).toEqual(data.price);
        expect(updatedTicket!.version).toEqual(data.version);
    });

    it('acks the message', async () => {
        const { data, listener, msg } = await setup();
        
        // call the onMessage function with the data object + message object
        await listener.onMessage( data, msg );

        // write assertions to make sure ack function is called
        expect(msg.ack).toHaveBeenCalled();
    });

    it('does not call ack if the event has a skipped version number', async () => {
        const { msg, data, listener, ticket } = await setup();

        data.version = 10;

        try {
            await listener.onMessage(data, msg);            
        } catch (error) {
            
        }

        expect(msg.ack).not.toHaveBeenCalled();
    });
});
