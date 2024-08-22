import {CreateTripDto} from "../models/create.trip.dto";
import {Trip} from "@prisma/client";
import {UpdateTripDto} from "../models/update.trip.dto";

export abstract class ITripRepository {
    abstract create(data: CreateTripDto): void;

    abstract get(): Promise<Trip[]>;

    abstract getById(id: string): Promise<Trip | null>;

    abstract update(id: string, data: UpdateTripDto): void;

    abstract delete(id: string): void;
}