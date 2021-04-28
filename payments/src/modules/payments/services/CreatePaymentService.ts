import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus,  } from "@bcmtickets/common";
import { PaymentCreatedPublisher } from "../../../events/publishers/PaymentCreatedPublisher";
import { natsWrapper } from "../../../shared/infra/clients/NATSStreamServer/NATSWrapper";
import { stripe } from "../../../shared/infra/clients/stripe";
import { Order } from "../infra/mongoose/entities/Order";
import { Payment } from "../infra/mongoose/entities/Payment";

interface IRequest {
    token: string;
    orderId: string;
    currentUserId: string;
}

interface IResponse {
    id: string;
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

    // Three distinct remote things.
    // TODO Each of these have to be in your own thread to ensure the successul execution.

    // The request save the charge into a database.
    // A trigger call the real stripe charge publisher.
    // Another trigger call to verify if the payment was done in stripe service and then save the informations to the Payment's database.
    // Once the payment was saved into database, a trigger invoke publisher to send message to queue in order warning others micro services about the payment was done

    // 1. StripePaymentListener
    const { id } = await stripe.charges.create({
        currency: 'usd',
        amount: order.price,
        source: token,
        metadata: {
            orderId: order.id
        }
    });

    // 2. UpdatePaymentListener(query stripe payment by order id and save it to database)
    const payment = Payment.build({
        orderId: order.id,
        thirdPartyPaymentId: id
    });

    await payment.save();

    // 3. After UpdatePaymentListener successful execution, a trigger put message on a queue
    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        thridPartyPaymentId: payment.thirdPartyPaymentId
    });

    return {
        id: payment.id
    };
};