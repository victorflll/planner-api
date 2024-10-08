import {Member} from "@prisma/client";
import {CreateMemberDto} from "../../models/member/create.member.dto";
import {UpdateMemberDto} from "../../models/member/update.member.dto";
import {TripOwner} from "../../models/trip/trip.owner.model";

export abstract class IMemberRepository {
    abstract createOwner(data: TripOwner, tripId: string): void;

    abstract create(members: CreateMemberDto[], tripId: string): void;

    abstract get(tripId: string): Promise<Member[]>;

    abstract getById(id: string, tripId: string): Promise<Member>;

    abstract getByEmail(email: string, tripId: string): Promise<Member>;

    abstract confirm(email: string, tripId: string, dto: UpdateMemberDto): void;

    abstract delete(id: string, tripId: string): void;
}