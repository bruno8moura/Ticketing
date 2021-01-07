import { useEffect } from 'react';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const signout = () => {
    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'delete',
        body: {},
        onSuccessful: () => Router.push('/')
    });

    useEffect(() => {
        doRequest();
    }, []);

    return <div>Signing you out...</div>;
};

export default signout;