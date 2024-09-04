import {CustomHttpException} from "./CustomHttpException";
import {HttpStatus} from "@nestjs/common";

export class ConflictException  extends CustomHttpException {
    constructor(message: string) {
        super(message, HttpStatus.CONFLICT);
    }
}