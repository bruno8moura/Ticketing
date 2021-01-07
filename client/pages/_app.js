import 'bootstrap/dist/css/bootstrap.css';
import api from "../api";
import Header from '../components/header';

const AppComponent = ({Component, pageProps, currentUser}) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} currentUser={currentUser}/>
        </div>
    );
};

AppComponent.getInitialProps = async ( appContext ) => {
    const { ctx } = appContext;    
    const client = api(ctx);    
    const { data } = await client.get('/api/users/currentuser');
    
    if(appContext.Component.getInitialProps){
        const pageProps = await appContext.Component.getInitialProps(ctx);
        return {
            ...data,
            pageProps
        }
    }
    
    return { ...data };
};

export default AppComponent;