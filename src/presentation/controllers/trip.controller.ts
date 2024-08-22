import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ITripService} from "../../domain/ports/interface.trip.service";
import {ApiTags} from "@nestjs/swagger";
import {CreateTripDto} from "../../domain/models/create.trip.dto";
import {UpdateTripDto} from "../../domain/models/update.trip.dto";

@ApiTags('Trip')
@Controller('trips')
export class TripController {
    constructor(private readonly tripService: ITripService) {
    }

    @Post('/')
    create(@Body() data: CreateTripDto) {
        this.tripService.create(data);
    }

    @Get('/')
    async get() {
        return await this.tripService.get();
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
        this.tripService.update(id, data);
    }

    @Delete('/:id')
    delete(@Param('id') id: string) {
        return this.tripService.delete(id);
    }
}
