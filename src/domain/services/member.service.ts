import {Member} from "@prisma/client";
import {CreateMemberDto} from "../models/member/create.member.dto";
import {MemberDto} from "../models/member/member.dto";
import {UpdateMemberDto} from "../models/member/update.member.dto";
import {IMemberService} from "../ports/member/interface.member.service";
import {IMemberRepository} from "../ports/member/interface.member.repository";
import {Injectable} from "@nestjs/common";
import {IMailService} from "../ports/email/interface.mail.service";
import {ITripRepository} from "../ports/trip/interface.trip.repository";
import {invitationMailTemplate} from "../../presentation/assets/templates/invitation.mail.template";
import {TripOwner} from "../models/trip/trip.owner.model";
import {createTripMailTemplate} from "../../presentation/assets/templates/create.trip.mail.template";

@Injectable()
export class MemberService implements IMemberService {
    constructor(private readonly memberRepository: IMemberRepository, private readonly mailService: IMailService, private tripRepository: ITripRepository) {
    }

    async createOwner(data: TripOwner, tripId: string) {
        const trip = await this.tripRepository.getById(tripId);

        const template = createTripMailTemplate(data.email, trip);
        this.mailService.sendMail(data.email, "Confirmação de Viagem!", template);

        return this.memberRepository.createOwner(data, tripId);
    }

    async create(data: CreateMemberDto[], tripId: string) {
        const trip = await this.tripRepository.getById(tripId);

        if (trip != null) {
            for (const member of data) {
                const template = invitationMailTemplate(member.email, trip);
                this.mailService.sendMail(member.email, "Convite para Viagem!", template);
            }

            return this.memberRepository.create(data, tripId);
        }
    }

    async get(tripId: string): Promise<MemberDto[]> {
        const members = await this.memberRepository.get(tripId);

        const result: MemberDto[] = [];

        for (const member of members) {
            result.push({
                email: member.email,
                name: member.name,
                status: member.status,
                owner: member.owner
            })
        }

        return result;
    }

    getById(id: string, tripId: string): Promise<Member> {
        return this.memberRepository.getById(id, tripId);
    }

    getByEmail(email: string, tripId: string): Promise<Member> {
        return this.memberRepository.getByEmail(email, tripId);
    }

    confirm(email: string, tripId: string, dto: UpdateMemberDto): void {
        return this.memberRepository.confirm(email, tripId, dto);
    }

    delete(id: string, tripId: string): void {
        return this.memberRepository.delete(id, tripId);
    }
}