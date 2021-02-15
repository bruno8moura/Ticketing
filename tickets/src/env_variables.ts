export const variable = {
    JWT_KEY: process.env.JWT_KEY, 
    MONGO_URI: process.env.MONGO_URI, 
    NATS_URL: process.env.NATS_URL, 
    NATS_CLUSTER_ID: process.env.NATS_CLUSTER_ID,
    NATS_CLIENT_ID: process.env.NATS_CLIENT_ID,
    PORT: process.env.PORT || 3000
}