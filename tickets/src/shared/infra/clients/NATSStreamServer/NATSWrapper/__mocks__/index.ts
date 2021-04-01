export const natsWrapper = {
    client: {
        publish: jest.fn((subject: string, data: string, callback: () => void) => {
            callback();
        }),
    },
};


// THE MOCK ONLY WORKS WITH JSON LIKE ABOVE!!!
// BUILD CLASS AND TO INSTANCE A OBJECT FROM IT DOESN'T WORK!!
/* 
class NATSWrapper {
    get client() {
        return {
            publish: jest.fn((subject: string, data: string, callback: () => void) => {
                callback();
            }),
        };
    }
}

// JUST ONE INSTANCE FOR ENTIRE APPLICATION! IT MEANS ONE CLIENT FOR ALL APPLICATION
export const natsWrapper = new NATSWrapper();  */

