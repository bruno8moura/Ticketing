import { TicketCreatedEvent } from '@bcmtickets/common';
import { Mongoose } from 'mongoose';
import { natsWrapper } from '../../../shared/infra/clients/NATSStreamServer/NATSWrapper';
import TicketCreatedListener from '../TicketCreatedListener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../modules/orders/infra/mongoose/entities/Ticket';

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert', 
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    // create a fake message object

    // Tells to typescript I know what I'm doing.
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

describe('Test when creating a ticket throught the stream server listener', () => {
    it('creates and saves a ticket', async () => {
        const { data, listener, msg } = await setup();

        // call the onMessage function with the data object + message object
        await listener.onMessage( data, msg );

        // write assertions to make sure a ticket was created!
        const ticket = await Ticket.findById(data.id);

        expect(ticket).toBeDefined();
        expect(ticket!.title).toEqual(data.title);
        expect(ticket!.price).toEqual(data.price);
    });

    it('acks the message', async () => {
        const { data, listener, msg } = await setup();
        
        // call the onMessage function with the data object + message object
        await listener.onMessage( data, msg );

        // write assertions to make sure ack function is called
        expect(msg.ack).toHaveBeenCalled();
    });
});