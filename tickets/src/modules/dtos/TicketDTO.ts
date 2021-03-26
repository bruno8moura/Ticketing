interface TicketDTO {
    title: string;
    price: number;
    userId: string;
    createdAt?: Date;
    id?: string;
    version?: number | undefined;
}

export default TicketDTO;