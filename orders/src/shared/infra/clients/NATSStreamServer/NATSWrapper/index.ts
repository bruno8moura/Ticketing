import nats, { Stan } from 'node-nats-streaming';

interface NATSProperties {
    clusterId: string;
    clientId: string;
    url: string;
}

class NATSWrapper {
    // The question mark here is saying to the typescript that the value 
    // of '_client' might be 'undefined' for a period of time
    private _client?: Stan;

    get client() {
        if(!this._client) {
            throw Error('Cannot access NATS client before connecting');
        }

        return this._client;
    }

    connect(props: NATSProperties): Promise<boolean> {
        const { clientId, clusterId, url } = props;

        this._client = nats.connect(clusterId, clientId, { url: url});
        
        return new Promise((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('Connected to NATS');
                return resolve(true);
            });

            this.client.on('error', (err) => {
                console.error('Error when connecting to the NATS', err.name, err.message);
                return reject();
            });
        });
    }
}

// JUST ONE INSTANCE FOR ENTIRE APPLICATION! IT MEANS ONE CLIENT FOR ALL APPLICATION
export const natsWrapper = new NATSWrapper(); 