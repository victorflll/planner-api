import {CustomHttpException} from "./CustomHttpException";
import {HttpStatus} from "@nestjs/common";

export class BadRequestException extends CustomHttpException {
    constructor(message: string) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}