import {CustomHttpException} from "./CustomHttpException";
import {HttpStatus} from "@nestjs/common";

export class InternalServerErrorException extends CustomHttpException {
    constructor(message: string = "An unknown error occurred. please contact the responsible team for more information.") {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}