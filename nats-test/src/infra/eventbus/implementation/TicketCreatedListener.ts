import { Message } from "node-nats-streaming";
import { TicketDTO } from "../../../../../common/src/events/dtos/TicketDTO";
import { Listener } from "../../../../../common/src/events/Listener";
import { Subjects } from "../../../../../common/src/events/Subjects";
import { TicketCreatedEvent } from "../../../../../common/src/events/TicketCreatedEvent";
import

export default class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    
    // Like final in java language. 
    // To prevent that another value type to be defined within variable 'subject' along the class.
    readonly subject = Subjects.TicketCreated;

    readonly queueGroupName = 'payments-service';
    ackWaitSeconds = 15;
        
    onMessage(data: TicketDTO, msg: Message): void {
        console.log(`#${msg.getSequence()}. `, data);
        msg.ack();
    }
}