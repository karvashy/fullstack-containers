const Notification = ({ type, message }) => {
    if(message === null){
        return null
    }
    if(type === 'error'){
        return (
            <div id="notification" className="error">
                {message}
            </div>
        )
    }
    else if(type === 'message'){
        return (
            <div id="notification" className="note">
                {message}
            </div>
        )

    }
    else{
        console.log('should not be here in message',message,'type',type)
        return null
    }
}

export default Notification
