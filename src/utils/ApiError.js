// creating class for handling errors in standard way like productions

class ApiError extends Error{
    constructor(statusCode, message="Something went wrong", errors=[], statck=""){

        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.success = false;
        this.data = null;

        if(statck){
            this.stack = statck
        }else{
            Error.captureStackTrace(this, this.constructor);
        }

    }
}
export {ApiError};