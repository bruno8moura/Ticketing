import TicketDTO from "../../dtos/TicketDTO";

export interface Filter {
    title?: string;
    userId?: string;
    price?: number;
}

export interface FindOneFilter {
    title: string;
    userId: string;
}

export interface FindByIdFilter {
    id: string;
}

interface ITicketRepository {
    findById(data: FindByIdFilter): Promise<TicketDTO | undefined>;
    findOne(data: FindOneFilter): Promise<TicketDTO | undefined>;
    create(data: TicketDTO): Promise<TicketDTO>;
    find(data: Filter): Promise<TicketDTO[]>;
    update(data: TicketDTO): Promise<TicketDTO>;
}

export default ITicketRepository;