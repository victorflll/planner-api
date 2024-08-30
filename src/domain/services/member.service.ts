import {Member} from "@prisma/client";
import {CreateMemberDto} from "../models/member/create.member.dto";
import {MemberDto} from "../models/member/member.dto";
import {UpdateMemberDto} from "../models/member/update.member.dto";
import {IMemberService} from "../ports/member/interface.member.service";
import {IMemberRepository} from "../ports/member/interface.member.repository";
import {Injectable} from "@nestjs/common";
import {IMailService} from "../ports/email/interface.mail.service";
import {ITripRepository} from "../ports/trip/interface.trip.repository";
import {mailTemplate} from "../../presentation/templates/mail.template";

@Injectable()
export class MemberService implements IMemberService {
    constructor(private readonly memberRepository: IMemberRepository, private readonly mailService: IMailService, private tripRepository: ITripRepository) {
    }

    async create(data: CreateMemberDto[], tripId: string) {
        const trip = await this.tripRepository.getById(tripId);

        if (trip != null) {
            for (const member of data) {
                const template = mailTemplate(member.email, trip);
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

    confirm(id: string, tripId: string, dto: UpdateMemberDto): void {
        return this.memberRepository.confirm(id, tripId, dto);
    }

    delete(id: string, tripId: string): void {
        return this.memberRepository.delete(id, tripId);
    }
}