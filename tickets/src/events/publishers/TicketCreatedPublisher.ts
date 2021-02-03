import { Publisher, Subjects, TicketCreatedEvent } from '@bcmtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    
}