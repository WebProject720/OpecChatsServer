export class ApiResponse {
    constructor(message = 'Request Successfull', data = {},success = true,  status = 200) {
        this.status = status;
        this.success = success;
        this.message = message;
        this.data = data;
    }

}