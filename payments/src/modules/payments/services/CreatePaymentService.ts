import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus,  } from "@bcmtickets/common";
import { stripe } from "../../../shared/infra/clients/stripe";
import { Order } from "../infra/mongoose/entities/Order";

interface IRequest {
    token: string;
    orderId: string;
    currentUserId: string;
}

interface IResponse {
    success: boolean;
}

export const execute = async ({orderId, token, currentUserId}: IRequest): Promise<IResponse> => {
    const order = await Order.findById(orderId);

    if(!order) {
        throw new NotFoundError();
    }

    if(order.userId !== currentUserId) {
        throw new NotAuthorizedError();
    }

    if(order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Cannot pay for an cancelled order');
    }

    const x = await stripe.charges.create({
        currency: 'usd',
        amount: order.price,
        source: token
    });

    return {
        success: true
    };
};