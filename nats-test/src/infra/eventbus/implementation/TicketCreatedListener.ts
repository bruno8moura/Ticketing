import { Message } from "node-nats-streaming";
import { Listener } from "../Listener";
import { Subjects } from "../Subjects";
import { TicketCreatedEvent, Ticket } from "../TicketCreatedEvent";

export default class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    
    // Like final in java language. 
    // To prevent that another value type to be defined within variable 'subject' along the class.
    readonly subject = Subjects.TicketCreated;

    readonly queueGroupName = 'payments-service';
    ackWaitSeconds = 15;
        
    onMessage(data: Ticket, msg: Message): void {
        console.log(`#${msg.getSequence()}. `, data);
        msg.ack();
    }
}