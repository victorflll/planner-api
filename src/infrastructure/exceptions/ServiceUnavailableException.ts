import {CustomHttpException} from "./CustomHttpException";
import {HttpStatus} from "@nestjs/common";

export class ServiceUnavailableException extends CustomHttpException {
    constructor(message: string) {
        super(message, HttpStatus.SERVICE_UNAVAILABLE);
    }
}