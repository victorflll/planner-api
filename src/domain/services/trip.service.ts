import {Injectable} from '@nestjs/common';
import {ITripService} from "../ports/interface.trip.service";
import {CreateTripDto} from "../models/create.trip.dto";
import {Trip} from "@prisma/client";
import {UpdateTripDto} from "../models/update.trip.dto";
import {ITripRepository} from "../ports/interface.trip.repository";
import {LocationModel} from "../models/location.model";

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
