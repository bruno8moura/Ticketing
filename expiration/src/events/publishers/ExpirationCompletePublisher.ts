import { Publisher, ExpirationCompleteEvent, Subjects } from '@bcmtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}