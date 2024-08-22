import {Member} from "@prisma/client";
import {CreateMemberDto} from "src/domain/models/member/create.member.dto";
import {IMemberRepository} from "../../domain/ports/member/interface.member.repository";
import {PrismaService} from "../prisma.service";
import {UpdateMemberDto} from "../../domain/models/member/update.member.dto";
import {MemberDto} from "../../domain/models/member/member.dto";

export class MemberRepository implements IMemberRepository {
    constructor(private readonly prismaService: PrismaService) {
    }

    async create(data: CreateMemberDto) {
        await this.prismaService.member.create({
            data: {
                email: data.email,
                owner: data.owner,
                status: data.owner,
            },
        });
    }

    async get(): Promise<MemberDto[]> {
        const members = await this.prismaService.member.findMany({
            select: {
                email: true,
                status: true,
            }
        });

        const result: MemberDto[] = [];

        for (const member of members) {
            result.push({
                email: member.email,
                status: member.status
            })
        }

        return result;
    }

    getById(id: string): Promise<Member | null> {
        return this.prismaService.member.findUnique({
            where: {
                id: id,
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

    async delete(id: string) {
        await this.prismaService.member.delete({
            where: {
                id: id
            }
        });
    }
}