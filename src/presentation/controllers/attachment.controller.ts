import { Controller, Get, Post, Delete, Put, Param, Body, Query } from "@nestjs/common";
import { ApiTags, ApiBody, ApiParam } from "@nestjs/swagger";
import { IAttachmentService } from "../../domain/ports/attachment/interface.attachment.service";
import { CreateAttachmentDto } from "../../domain/models/attachment/create.attachment.dto";
import { UpdateAttachmentDto } from "../../domain/models/attachment/update.attachment.dto";
import { Attachment } from "@prisma/client";

@ApiTags('Attachment')
@Controller('attachments')
export class AttachmentController {
    constructor(private readonly attachmentService: IAttachmentService) {}

    @Post('/')
    @ApiBody({ type: CreateAttachmentDto })
    create(@Body() data: CreateAttachmentDto, @Query('tripId') tripId: string): void {
        this.attachmentService.create(data, tripId);
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
