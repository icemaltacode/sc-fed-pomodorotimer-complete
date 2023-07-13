function Heading({ role = 'primary', children }) {
    switch(role) {
        case 'secondary':
            return <h2 className='text-secondary-emphasis'>
                {children}
            </h2>
        case 'tertiary':
            return <h6 className='text-tertiary-emphasis'>
                {children}
            </h6>
        default:
            return <h1 className='text-primary-emphasis'>
                {children}
            </h1>
    }
}

export default Heading;