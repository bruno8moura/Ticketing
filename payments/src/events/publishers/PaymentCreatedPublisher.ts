import { Subjects, Publisher, PaymentCreatedEvent } from '@bcmtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    
}