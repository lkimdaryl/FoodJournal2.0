import './Error.css'

export default function Error403() {
    return(
        <div className='center-container'>
            <div className='jockey-one-regular error-container'>
                <h1 className='error-page-message'>Error 403: You are not authorized to access this page.</h1>
                <a className='link' href='/'>Back to Home</a>
            </div>            
        </div>

    );
}