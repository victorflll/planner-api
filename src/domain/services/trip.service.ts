import {Injectable} from '@nestjs/common';
import {ITripService} from "../ports/trip/interface.trip.service";
import {CreateTripDto} from "../models/trip/create.trip.dto";
import {Trip} from "@prisma/client";
import {UpdateTripDto} from "../models/trip/update.trip.dto";
import {ITripRepository} from "../ports/trip/interface.trip.repository";
import {LocationModel} from "../models/trip/location.model";

@Injectable()
export class TripService implements ITripService {
    constructor(private tripRepository: ITripRepository) {
    }

    getCities(): Promise<LocationModel[]> {
        return this.tripRepository.getCities();
    }


    create(data: CreateTripDto): void {
        this.tripRepository.create(data);
    }

    delete(id: string): void {
        this.tripRepository.delete(id);
    }

    get(): Promise<Trip[]> {
        return this.tripRepository.get();
    }

    getById(id: string): Promise<Trip | null> {
        return this.tripRepository.getById(id);
    }

    update(id: string, data: UpdateTripDto): void {
        this.tripRepository.update(id, data);
    }

}
