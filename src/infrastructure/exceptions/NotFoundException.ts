import {CustomHttpException} from "./CustomHttpException";
import {HttpStatus} from "@nestjs/common";

export class NotFoundException extends CustomHttpException {
    constructor(message: string) {
        super(message, HttpStatus.NOT_FOUND);
    }
}