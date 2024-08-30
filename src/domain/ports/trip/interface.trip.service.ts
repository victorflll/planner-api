import {CreateTripDto} from "../../models/trip/create.trip.dto";
import {Trip} from "@prisma/client";
import {UpdateTripDto} from "../../models/trip/update.trip.dto";
import {LocationModel} from "../../models/trip/location.model";

export abstract class ITripService {
    abstract getCities(startsWith: string): Promise<LocationModel[]>;

    abstract create(data: CreateTripDto): void;

    abstract get(): Promise<Trip[]>;

    abstract getById(id: string): Promise<Trip>;

    abstract update(id: string, data: UpdateTripDto): void;

    abstract delete(id: string): void;
}