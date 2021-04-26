export const stripe = {
    charges: {
        create: jest.fn().mockResolvedValue({}) // to return a Promise
    }
}