import { UserPayload } from "@bcmtickets/common";

declare global {
    namespace Express{
        interface Request {
            currentUser?: UserPayload;
        }
    }
}