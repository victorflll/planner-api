import {Injectable} from '@nestjs/common';
import {ITripService} from "../ports/trip/interface.trip.service";
import {CreateTripDto} from "../models/trip/create.trip.dto";
import {Trip} from "@prisma/client";
import {UpdateTripDto} from "../models/trip/update.trip.dto";
import {ITripRepository} from "../ports/trip/interface.trip.repository";
import {LocationModel} from "../models/trip/location.model";
import {IMemberService} from "../ports/member/interface.member.service";

@Injectable()
export class TripService implements ITripService {
    constructor(private memberService: IMemberService, private tripRepository: ITripRepository) {
    }

    getCities(startsWith: string): Promise<LocationModel[]> {
        return this.tripRepository.getCities(startsWith);
    }

    async create(data: CreateTripDto): Promise<Trip> {
        const trip = await this.tripRepository.create(data);

        this.memberService.createOwner(data.owner, trip.id);
        this.memberService.create(data.members, trip.id);

        return trip;
    }

    delete(id: string): void {
        return this.tripRepository.delete(id);
    }

    get(): Promise<Trip[]> {
        return this.tripRepository.get();
    }

    getById(id: string): Promise<Trip> {
        return this.tripRepository.getById(id);
    }

    update(id: string, data: UpdateTripDto): void {
        return this.tripRepository.update(id, data);
    }

}
