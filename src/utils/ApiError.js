export class ApiError extends Error {
    constructor(message = 'Request Failled', data = {},success = false, statusCode = 400) {
        super();
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.data = data;
    }
}