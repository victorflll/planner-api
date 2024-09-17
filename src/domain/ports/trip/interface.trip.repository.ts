import {CreateTripDto} from "../../models/trip/create.trip.dto";
import {Trip} from "@prisma/client";
import {UpdateTripDto} from "../../models/trip/update.trip.dto";
import {LocationModel} from "../../models/trip/location.model";

export abstract class ITripRepository {
    abstract getCities(startsWith: string): Promise<LocationModel[]>;

    abstract create(data: CreateTripDto): Promise<Trip>;

    abstract get(): Promise<Trip[]>;

    abstract getById(id: string): Promise<Trip>;

    abstract update(id: string, data: UpdateTripDto): void;

    abstract delete(id: string): void;
}