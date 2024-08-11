export class ApiError extends Error {
    constructor(message = 'Request Failled', data = {},success = false, status = 400) {
        super();
        this.status = status;
        this.success = success;
        this.message = message;
        this.data = data;
    }
}