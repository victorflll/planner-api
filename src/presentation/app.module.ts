import { Module } from '@nestjs/common';
import { TripController } from './controllers/trip.controller';
import { TripService } from '../domain/services/trip.service';
import { PrismaService } from "../infrastructure/prisma.service";
import { TripRepository } from "../infrastructure/repositories/trip.repository";
import { ITripRepository } from "../domain/ports/trip/interface.trip.repository";
import { ITripService } from "../domain/ports/trip/interface.trip.service";
import { HttpModule } from '@nestjs/axios';
import { IMemberRepository } from "../domain/ports/member/interface.member.repository";
import { MemberRepository } from "../infrastructure/repositories/member.repository";
import { IMemberService } from "../domain/ports/member/interface.member.service";
import { MemberService } from "../domain/services/member.service";
import { MemberController } from "./controllers/member.controller";
import { ActivityController } from './controllers/activity.controller'; 
import { ActivityService } from '../domain/services/activity.service'; 
import { IActivityRepository } from '../domain/ports/activity/interface.activity.repository'; 
import { IActivityService } from 'src/domain/ports/activity/interface.activity.service';
import { ActivityRepository } from '../infrastructure/repositories/activity.repository'; 

@Module({
  imports: [HttpModule],
  controllers: [TripController, MemberController, ActivityController],
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
    },
    {
      provide: IActivityRepository,
      useClass: ActivityRepository
    },
    {
      provide: IActivityService,
      useClass: ActivityService
    }
  ],
})
export class AppModule {}
