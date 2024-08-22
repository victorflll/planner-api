import {CreateTripDto} from "../../models/trip/create.trip.dto";
import {Trip} from "@prisma/client";
import {UpdateTripDto} from "../../models/trip/update.trip.dto";
import {LocationModel} from "../../models/trip/location.model";
import {TripOwner} from "../../models/trip/trip.owner.model";

export abstract class ITripRepository {
    abstract getCities(): Promise<LocationModel[]>;

    abstract create(data: CreateTripDto): Promise<TripOwner>;

    abstract get(): Promise<Trip[]>;

    abstract getById(id: string): Promise<Trip | null>;

    abstract update(id: string, data: UpdateTripDto): void;

    abstract delete(id: string): void;
}