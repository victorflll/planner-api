import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {CustomHttpException} from "../exceptions/CustomHttpException";

@Catch(CustomHttpException)
export class HttpExceptionMiddleware implements ExceptionFilter {
    catch(exception: CustomHttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        response.status(status).json({
            statusCode: status,
            error: this.getErrorName(status),
            message: [exception.message],
        });
    }

    private getErrorName(status: number): string {
        const statusNames = {
            400: 'Bad Request',
            404: 'Not Found',
            409: 'Conflict',
            500: 'Internal Server Error',
            502: 'Service Unavailable',
        };

        return statusNames[status] || 'Error';
    }
}
