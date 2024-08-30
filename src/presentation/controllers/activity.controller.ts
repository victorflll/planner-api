import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseFilters} from '@nestjs/common';
import {ApiBody, ApiTags} from "@nestjs/swagger";
import {IActivityService} from "../../domain/ports/activity/interface.activity.service";
import {CreateActivityDto} from "../../domain/models/activity/create.activity.dto";
import {UpdateActivityDto} from "../../domain/models/activity/update.activity.dto";
import {Activities} from '@prisma/client';
import {ActivityGroupDto} from "../../domain/models/activity/activity.group.dto";
import {HttpExceptionMiddleware} from "../../infrastructure/middlewares/HttpExceptionMiddleware";

@ApiTags('Activity')
@Controller('activities')
@UseFilters(HttpExceptionMiddleware)
export class ActivityController {
    constructor(private readonly activityService: IActivityService) {
    }

    @Post('/')
    @ApiBody({type: [CreateActivityDto]})
    async create(@Body() data: CreateActivityDto[], @Query('tripId') tripId: string) {
        return await this.activityService.create(data, tripId);
    }

    @Get('/')
    async get(@Query('tripId') tripId: string): Promise<ActivityGroupDto[]> {
        return await this.activityService.get(tripId);
    }

    @Get('/:id')
    async getById(@Param('id') id: string, @Query('tripId') tripId: string): Promise<Activities | null> {
        return await this.activityService.getById(id, tripId);
    }

    @Patch('/:id')
    async update(
        @Body() data: UpdateActivityDto,
        @Param('id') id: string,
        @Query('tripId') tripId: string,
    ) {
        return await this.activityService.update(id, tripId, data);
    }

    @Patch(':id/confirm')
    async confirmActivity(
        @Param('id') id: string,
        @Query('tripId') tripId: string,
    ) {
        await this.activityService.confirm(id, tripId);
    }

    @Delete('/:id')
    async delete(@Param('id') id: string, @Query('tripId') tripId: string) {
        return await this.activityService.delete(id, tripId);
    }
}
