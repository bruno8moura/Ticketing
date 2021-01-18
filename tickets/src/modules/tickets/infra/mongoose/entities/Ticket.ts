import mongoose from 'mongoose';

// Describes the properties that are required to create a new Ticket
// What the user need set to create a new Ticket
import TicketAttrs from '../../../../dtos/TicketDTO';

// Describes the properties that a Ticket Document has
// What is needed to persist on database
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    createdAt: Date;
}

// Describes the properties that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: new Date(),
            required: true
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

// Grant that Ticket Schema is followed
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };