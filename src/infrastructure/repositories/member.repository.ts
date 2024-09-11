import {Member} from "@prisma/client";
import {IMemberRepository} from "../../domain/ports/member/interface.member.repository";
import {PrismaService} from "../prisma.service";
import {UpdateMemberDto} from "../../domain/models/member/update.member.dto";
import {Injectable} from "@nestjs/common";
import {ConflictException} from "../exceptions/ConflictException";
import {InternalServerErrorException} from "../exceptions/InternalServerErrorException";
import {NotFoundException} from "../exceptions/NotFoundException";import {TripOwner} from "../../domain/models/trip/trip.owner.model";
import {ITripRepository} from "../../domain/ports/trip/interface.trip.repository";
import {CreateMemberDto} from "../../domain/models/member/create.member.dto";

@Injectable()
export class MemberRepository implements IMemberRepository {
    private primaryKeyViolationCode: string = "P2002";

    constructor(private readonly prismaService: PrismaService, private readonly tripRepository: ITripRepository) {
    }

    async createOwner(data: TripOwner, tripId: string) {
        await this.prismaService.member.create({
            data: {
                name: data.name,
                email: data.email,
                owner: true,
                status: true,
                tripId: tripId,
            }
        });
    }

    async create(members: CreateMemberDto[], tripId: string) {
        try {
            await this.prismaService.member.createMany({
                data: members.map(member => ({
                    email: member.email,
                    owner: false,
                    status: false,
                    tripId: tripId,
                })),
            });
        } catch (error) {
            if (error.code === this.primaryKeyViolationCode) {
                throw new ConflictException("A member with the email and trip already exists.");
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async get(tripId: string): Promise<Member[]> {
        const trip = await this.tripRepository.getById(tripId);

        return this.prismaService.member.findMany({
            where: {
                tripId: trip.id,
            }
        });
    }

    async getById(id: string, tripId: string): Promise<Member> {
        const trip = await this.tripRepository.getById(tripId);

        console.log(id);
        console.log(tripId);

        const result = await this.prismaService.member.findUnique({
            where: {
                id: id,
                tripId: trip.id,
            }
        });

        if (!result) {
            throw new NotFoundException('Member cannot be found because there is no member with the id.');
        }

        return result;
    }

    async getByEmail(email: string, tripId: string): Promise<Member> {
        const trip = await this.tripRepository.getById(tripId);

        const result = await this.prismaService.member.findFirst({
            where: {
                email: email,
                tripId: trip.id,
            }
        });

        if (!result) {
            throw new NotFoundException('Member cannot be found because there is no member with the e-mail in these trip.');
        }

        return result;
    }

    async confirm(email: string, tripId: string, dto: UpdateMemberDto) {
        const trip = await this.tripRepository.getById(tripId);

        const member = await this.getByEmail(email, tripId);

        await this.prismaService.member.update({
            where: {
                id: member.id,
                tripId: trip.id,
            },
            data: {
                name: dto.name,
                status: true
            }
        });
    }

    async delete(id: string, tripId: string) {
        const trip = await this.tripRepository.getById(tripId);

        const member = await this.getById(id, tripId);

        await this.prismaService.member.delete({
            where: {
                id: member.id,
                tripId: trip.id
            }
        });
    }
}