interface OrderDTO {
    id?: string;
    userId: string;
    status: string;
    expiresAt: Date;
}

export default OrderDTO;