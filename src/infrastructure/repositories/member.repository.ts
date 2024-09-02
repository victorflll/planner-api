import { Member } from "@prisma/client";
import { CreateMemberDto } from "src/domain/models/member/create.member.dto";
import { IMemberRepository } from "../../domain/ports/member/interface.member.repository";
import { PrismaService } from "../prisma.service";
import { UpdateMemberDto } from "../../domain/models/member/update.member.dto";
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from "@nestjs/common";
import { TripOwner } from "../../domain/models/trip/trip.owner.model";
import { ITripRepository } from "../../domain/ports/trip/interface.trip.repository";

@Injectable()
export class MemberRepository implements IMemberRepository {
    private primaryKeyViolationCode: string = "P2002";

    constructor(private readonly prismaService: PrismaService, private readonly tripRepository: ITripRepository) {
    }

    async createOwner(data: TripOwner, tripId: string) {
        if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
            throw new BadRequestException("Name must be a non-empty string.");
        }
        if (!data.email || typeof data.email !== "string") {
            throw new BadRequestException("Email must be a string.");
        }
        if (!tripId || typeof tripId !== "string") {
            throw new BadRequestException("Invalid trip ID.");
        }

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

    async create(data: CreateMemberDto[], tripId: string) {
        if (!tripId || typeof tripId !== "string") {
            throw new BadRequestException("Invalid trip ID.");
        }

        data.forEach((member) => {
            if (!member.email || typeof member.email !== "string") {
                throw new BadRequestException("Email must be a string.");
            }
            if (typeof member.owner !== "boolean") {
                throw new BadRequestException("Owner must be a boolean.");
            }
        });

        try {
            await this.prismaService.member.createMany({
                data: data.map((member) => ({
                    email: member.email,
                    owner: member.owner,
                    status: member.owner,
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
        if (!tripId || typeof tripId !== "string") {
            throw new BadRequestException("Invalid trip ID.");
        }

        const trip = await this.tripRepository.getById(tripId);

        return this.prismaService.member.findMany({
            where: {
                tripId: trip.id,
            }
        });
    }

    async getById(id: string, tripId: string): Promise<Member> {
        if (!id || typeof id !== "string" || !tripId || typeof tripId !== "string") {
            throw new BadRequestException("Invalid ID or trip ID.");
        }

        const trip = await this.tripRepository.getById(tripId);

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
        if (!email || typeof email !== "string") {
            throw new BadRequestException("Email must be a string.");
        }
        if (!tripId || typeof tripId !== "string") {
            throw new BadRequestException("Invalid trip ID.");
        }

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

    async confirm(id: string, tripId: string, dto: UpdateMemberDto) {
        if (!id || typeof id !== "string" || !tripId || typeof tripId !== "string") {
            throw new BadRequestException("Invalid ID or trip ID.");
        }
        if (!dto.name || typeof dto.name !== "string" || dto.name.trim() === "") {
            throw new BadRequestException("Name must be a non-empty string.");
        }

        const trip = await this.tripRepository.getById(tripId);

        const member = await this.getById(id, tripId);

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
        if (!id || typeof id !== "string" || !tripId || typeof tripId !== "string") {
            throw new BadRequestException("Invalid ID or trip ID.");
        }

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