import {Member} from "@prisma/client";
import {CreateMemberDto} from "src/domain/models/member/create.member.dto";
import {IMemberRepository} from "../../domain/ports/member/interface.member.repository";
import {PrismaService} from "../prisma.service";
import {UpdateMemberDto} from "../../domain/models/member/update.member.dto";
import {MemberDto} from "../../domain/models/member/member.dto";
import {Injectable} from "@nestjs/common";
import {TripOwner} from "../../domain/models/trip/trip.owner.model";

@Injectable()
export class MemberRepository implements IMemberRepository {
    constructor(private readonly prismaService: PrismaService) {
    }

    async create(data: CreateMemberDto[], trip: TripOwner | null) {
        await this.prismaService.member.createMany({
            data: data.map(member => ({
                email: member.email,
                owner: member.owner,
                status: member.owner,
                tripId: trip.tripId,
                name: member.owner ? trip.ownerName : null,
            })),
        });
    }

    async get(tripId: string): Promise<Member[]> {
        return this.prismaService.member.findMany({
            where: {
                tripId: tripId,
            }
        });
    }

    getById(id: string, tripId: string): Promise<Member | null> {
        return this.prismaService.member.findUnique({
            where: {
                id: id,
                tripId: tripId,
            }
        });
    }

    async confirm(id: string, tripId: string, dto: UpdateMemberDto) {
        await this.prismaService.member.update({
            where: {
                id: id,
                tripId: tripId,
            },
            data: {
                name: dto.name,
                status: true
            }
        })
    }

    async delete(id: string, tripId: string) {
        await this.prismaService.member.delete({
            where: {
                id: id,
                tripId: tripId
            }
        });
    }
}