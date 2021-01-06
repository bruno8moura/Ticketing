import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccessful}) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try {
            const response = await axios[method](url, body);
            if(onSuccessful){
                onSuccessful(response.data);
            }

            return response.data;
        } catch (err) {
            setErrors(
                <div className="aler alert-danger">
                    <h4>Ooops....</h4>
                    <ul className="my-0">
                        {err.response.data.messages.map(msg => <li key={msg}>{msg}</li>)}
                    </ul>
                </div>
            );
        }
    }

    return { doRequest, errors };
};

export default useRequest;