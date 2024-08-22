import {CreateTripDto} from "../models/create.trip.dto";
import {Trip} from "@prisma/client";
import {UpdateTripDto} from "../models/update.trip.dto";
import {LocationModel} from "../models/locationModel";

export abstract class ITripService {
    abstract getCities(): Promise<LocationModel[]>;

    abstract create(data: CreateTripDto): void;

    abstract get(): Promise<Trip[]>;

    abstract getById(id: string): Promise<Trip | null>;

    abstract update(id: string, data: UpdateTripDto): void;

    abstract delete(id: string): void;
}