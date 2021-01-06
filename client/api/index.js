import axios from 'axios';

const api = ( { req } ) => {
    const isWeOnTheServer = !!req;
    if(isWeOnTheServer){
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.kube-system.svc.cluster.local',
            /* {
                    host: 'ticketing.dev',
                    cookie: req.cookie
                }  */
            headers: req.headers,
            validateStatus: (status) => {
                //Not break when status differ from 20...
                return true;
            }
        });
    }

    return axios.create({
        baseURL: '/'
    });    
};

export default api;