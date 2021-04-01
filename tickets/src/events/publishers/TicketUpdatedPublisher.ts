import { Publisher, Subjects, TicketUpdatedEvent } from '@bcmtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    
}
