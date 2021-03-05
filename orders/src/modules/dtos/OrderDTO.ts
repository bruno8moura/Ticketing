import TicketDTO from "./TicketDTO";

interface OrderDTO {
    id: string;
    userId: string;
    status: string;
    expiresAt: Date;
    ticket: TicketDTO;
}

export default OrderDTO;