import { Publisher } from "../../../../../common/src/events/Publisher";
import { Subjects } from "../../../../../common/src/events/Subjects";
import { TicketCreatedEvent } from "../../../../../common/src/events/TicketCreatedEvent";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}