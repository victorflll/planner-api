import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseFilters} from '@nestjs/common';
import {ITripService} from "../../domain/ports/trip/interface.trip.service";
import {ApiTags} from "@nestjs/swagger";
import {CreateTripDto} from "../../domain/models/trip/create.trip.dto";
import {UpdateTripDto} from "../../domain/models/trip/update.trip.dto";
import {HttpExceptionMiddleware} from "../../infrastructure/middlewares/HttpExceptionMiddleware";

@ApiTags('Trip')
@Controller('trips')
@UseFilters(HttpExceptionMiddleware)
export class TripController {
    constructor(private readonly tripService: ITripService) {
    }

    @Post('/')
    create(@Body() data: CreateTripDto) {
        return this.tripService.create(data);
    }

    @Get('/')
    async get() {
        return await this.tripService.get();
    }

    @Get('/cities')
    async getCities(@Query('startsWith') startsWith: string) {
        return await this.tripService.getCities(startsWith);
    }

    @Get('/:id')
    async getById(@Param('id') id: string) {
        return await this.tripService.getById(id);
    }

    @Put('/:id')
    update(
        @Body() data: UpdateTripDto,
        @Param('id') id: string,
    ) {
        return this.tripService.update(id, data);
    }

    @Delete('/:id')
    delete(@Param('id') id: string) {
        return this.tripService.delete(id);
    }
}
