import { OrderStatus } from '@bcmtickets/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../../../../app';
import { Order } from '../../../mongoose/entities/Order';
import { stripe } from '../../../../../../shared/infra/clients/stripe';
import { Payment } from '../../../mongoose/entities/Payment';

it('should returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
        token: 'adfadf',
        orderId: mongoose.Types.ObjectId().toHexString()
    })    
    .expect(404);
});

it('should returns a 401 when purchasing an order that does not belong to the user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created,
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0
    });

    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
        token: 'adfadf',
        orderId: order.id
    })
    .expect(401);
});

it('should returns a 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Cancelled,
        userId,
        version: 0
    });

    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
        token: 'adfadf',
        orderId: order.id
    })
    .expect(400);
});

it('should returns a 201 with valid inputs', async () => {
    const userId = mongoose.Types.ObjectId().toHexString()
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
        token: 'tok_visa',
        orderId: order.id
    })
    .expect(201);

    const stripeCharges = await stripe.charges.list({limit: 50});
    const stripeCharge = stripeCharges.data.find( charge => charge.amount === price );

    expect(stripeCharge).toBeDefined();

    // expect(stripeCharge!.source).toEqual('tok_visa');
    expect(stripeCharge!.amount).toEqual(price);
    expect(stripeCharge!.currency).toEqual('usd'); 

    /* 
    
    This code require that jest mock is implemented.
    
    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(20 * 100);
    expect(chargeOptions.currency).toEqual('usd'); 
    */

    const payment = await Payment.findOne({
        orderId: order.id,
        thirdPartyPaymentId: stripeCharge!.id
    });

    expect(payment).not.toBeNull();
});