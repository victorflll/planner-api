import {Injectable} from '@nestjs/common';
import {ITripService} from "../ports/trip/interface.trip.service";
import {CreateTripDto} from "../models/trip/create.trip.dto";
import {Trip} from "@prisma/client";
import {UpdateTripDto} from "../models/trip/update.trip.dto";
import {ITripRepository} from "../ports/trip/interface.trip.repository";
import {LocationModel} from "../models/trip/location.model";
import {IMemberService} from "../ports/member/interface.member.service";
import {IMemberRepository} from "../ports/member/interface.member.repository";

@Injectable()
export class TripService implements ITripService {
    constructor(private memberService: IMemberService, private tripRepository: ITripRepository, private memberRepository: IMemberRepository) {
    }

    getCities(): Promise<LocationModel[]> {
        return this.tripRepository.getCities();
    }


    async create(data: CreateTripDto) {
        const tripId = await this.tripRepository.create(data);

        this.memberRepository.createOwner(data.owner, tripId);
        this.memberService.create(data.members, tripId);
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
