import { Subjects } from '../Subjects';

/**
 * This module exists to do the coupling with the two types of data: Subject and Ticket
 */

export interface Ticket {
    id: string;
    title: string;
    price: number;
}

export interface TicketCreatedEvent {
    subject: Subjects.TicketCreated;
    data: Ticket;
}