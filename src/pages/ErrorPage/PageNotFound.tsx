import './Error.css'

export default function PageNotFound() {
    return(
        <div className='center-container'>
            <div className='jockey-one-regular error-container'>
                <h1 className='error-page-message'>Oops!! This page could not be found.</h1>
                <a className='link' href='/'>Back to Home</a>
            </div>            
        </div>

    );
}