import { OrderStatus } from '@bcmtickets/common';
import mongoose from 'mongoose';
import { TicketDoc } from './Ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { setLocalTimezone } from '@bcmtickets/common';

// Describes the properties that are required to create a new Ticket
// What the user need set to create a new Ticket

// This object can differ from OrderDoc, because of that we create two separated interfaces.
interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

// Describes the properties that a Ticket Document has
// What is needed to persist on database
export interface OrderDoc extends mongoose.Document {
    userId: string; //'string' here is a typescript type. Reason why 's' from 'string' is lower case
    status: OrderStatus;
    expiresAt: Date;
    version: number;
    ticket: TicketDoc;
}

// Describes the properties that a Ticket Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
        userId: {
            type: String, // This is the ECMA String definition. Mongoose will consume that.
            required: true
        },
        status: {
            type: String,
            required: true,

            //grant only OrderStatus values into the field
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created
        },        
        expiresAt: {
            type: mongoose.Schema.Types.Date,
            default: setLocalTimezone(new Date()),
            required: false
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        }
    },
    {
        toJSON:{
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

/**
 * Grant that Schema is followed
 * This is what is going to give us the build method 
 * on the actual order model.
 * 
 * This is the OrderModel.build implementation.
 *  */
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };

export { OrderStatus };