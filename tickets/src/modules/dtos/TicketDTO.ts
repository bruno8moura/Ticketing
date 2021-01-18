interface TicketDTO {
    title: string;
    price: number;
    userId: string;
    createdAt?: Date;
    id?: string;
    _v?: number | undefined;
}

export default TicketDTO;