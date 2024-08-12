export class ApiResponse {
    constructor(message = 'Request Successfull', data = {},success = true,  statusCode = 200) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.data = data;
    }

}