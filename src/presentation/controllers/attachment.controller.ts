import {Controller, Get, Post, Delete, Put, Param, Body, Query, UseFilters} from "@nestjs/common";
import { ApiTags, ApiBody } from "@nestjs/swagger";
import { IAttachmentService } from "../../domain/ports/attachment/interface.attachment.service";
import { CreateAttachmentDto } from "../../domain/models/attachment/create.attachment.dto";
import { UpdateAttachmentDto } from "../../domain/models/attachment/update.attachment.dto";
import { Attachment } from "@prisma/client";
import {HttpExceptionMiddleware} from "../../infrastructure/middlewares/HttpExceptionMiddleware";

@ApiTags('Attachment')
@Controller('attachments')
@UseFilters(HttpExceptionMiddleware)
export class AttachmentController {
    constructor(private readonly attachmentService: IAttachmentService) {}

    @Post('/')
    @ApiBody({ type: [CreateAttachmentDto] })
    create(@Body() data: CreateAttachmentDto[], @Query('tripId') tripId: string): void {
        return this.attachmentService.create(data, tripId);
    }

    @Get('/')
    async get(@Query('tripId') tripId: string): Promise<Attachment[]> {
        return await this.attachmentService.get(tripId);
    }

    @Get('/:id')
    async getById(@Param('id') id: string, @Query('tripId') tripId: string): Promise<Attachment| null> {
        return await this.attachmentService.getById(id, tripId);
    }

    @Put('/:id')
    @ApiBody({ type: UpdateAttachmentDto })
    update(@Param('id') id: string, @Query('tripId') tripId: string, @Body() data: UpdateAttachmentDto){
        return this.attachmentService.update(id, tripId, data);
    }

    @Delete('/:id')
    delete(@Param('id') id: string, @Query('tripId') tripId: string){
        return this.attachmentService.delete(id, tripId);
    }
}
