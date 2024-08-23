import {Member} from "@prisma/client";
import {CreateMemberDto} from "../models/member/create.member.dto";
import {MemberDto} from "../models/member/member.dto";
import {UpdateMemberDto} from "../models/member/update.member.dto";
import {IMemberService} from "../ports/member/interface.member.service";
import {IMemberRepository} from "../ports/member/interface.member.repository";
import {Injectable} from "@nestjs/common";
import {TripOwner} from "../models/trip/trip.owner.model";

@Injectable()
export class MemberService implements IMemberService {
    constructor(private readonly memberRepository: IMemberRepository) {
    }

    create(data: CreateMemberDto[], tripId: string): void {
        return this.memberRepository.create(data, tripId);
    }

    async get(tripId: string): Promise<MemberDto[]> {
        const members = await this.memberRepository.get(tripId);

        const result: MemberDto[] = [];

        for (const member of members) {
            result.push({
                email: member.email,
                status: member.status,
                owner: member.owner
            })
        }

        return result;
    }

    getById(id: string, tripId: string): Promise<Member | null> {
        return this.memberRepository.getById(id, tripId);
    }

    confirm(id: string, tripId: string, dto: UpdateMemberDto): void {
        return this.memberRepository.confirm(id, tripId, dto);
    }

    delete(id: string, tripId: string): void {
        return this.memberRepository.delete(id, tripId);
    }
}