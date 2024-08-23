import {Member} from "@prisma/client";
import {CreateMemberDto} from "../../models/member/create.member.dto";
import {UpdateMemberDto} from "../../models/member/update.member.dto";
import {MemberDto} from "../../models/member/member.dto";

export abstract class IMemberService {
    abstract create(data: CreateMemberDto[], tripId: string): void;

    abstract get(tripId: string): Promise<MemberDto[]>;

    abstract getById(id: string, tripId: string): Promise<Member | null>;

    abstract confirm(id: string, tripId: string, dto: UpdateMemberDto): void;

    abstract delete(id: string, tripId: string): void;
}