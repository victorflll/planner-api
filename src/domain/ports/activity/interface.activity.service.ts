import { Activities } from "@prisma/client";
import { CreateActivityDto } from "src/domain/models/activity/create.activity.dto";
import { UpdateActivityDto } from "src/domain/models/activity/update.activity.dto";

export abstract class IActivityService {
    
    abstract create(data: CreateActivityDto[], tripId: string): Promise<void>;

    abstract get(tripId: string): Promise<Activities[]>;

    abstract getById(id: string, tripId: string): Promise<Activities | null>;

    abstract update(id: string, tripId: string, dto: UpdateActivityDto): Promise<void>;

    abstract confirm(id: string, tripId: string): Promise<void>;
    
    abstract delete(id: string, tripId: string): Promise<void>;
}
