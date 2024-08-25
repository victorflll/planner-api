import {Module} from '@nestjs/common';
import {TripController} from './controllers/trip.controller';
import {TripService} from '../domain/services/trip.service';
import {PrismaService} from "../infrastructure/prisma.service";
import {TripRepository} from "../infrastructure/repositories/trip.repository";
import {ITripRepository} from "../domain/ports/trip/interface.trip.repository";
import {ITripService} from "../domain/ports/trip/interface.trip.service";
import { HttpModule } from '@nestjs/axios';
import {IMemberRepository} from "../domain/ports/member/interface.member.repository";
import {MemberRepository} from "../infrastructure/repositories/member.repository";
import {IMemberService} from "../domain/ports/member/interface.member.service";
import {MemberService} from "../domain/services/member.service";
import {MemberController} from "./controllers/member.controller";

@Module({
    imports: [HttpModule],
    controllers: [TripController, MemberController],
    providers: [
        PrismaService,
        {
            provide: ITripRepository,
            useClass: TripRepository
        },
        {
            provide: ITripService,
            useClass: TripService
        },
        {
            provide: IMemberRepository,
            useClass: MemberRepository
        },
        {
            provide: IMemberService,
            useClass: MemberService
        }
    ],
})
export class AppModule {
}
