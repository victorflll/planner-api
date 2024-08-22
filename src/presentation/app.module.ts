import {Module} from '@nestjs/common';
import {TripController} from './controllers/trip.controller';
import {TripService} from '../domain/services/trip.service';
import {PrismaService} from "../infrastructure/prisma.service";
import {TripRepository} from "../infrastructure/repositories/trip.repository";
import {ITripRepository} from "../domain/ports/trip/interface.trip.repository";
import {ITripService} from "../domain/ports/trip/interface.trip.service";
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [TripController],
    providers: [
        PrismaService,
        TripRepository,
        TripService,
        {
            provide: ITripRepository,
            useClass: TripRepository
        },
        {
            provide: ITripService,
            useClass: TripService
        }
    ],
})
export class AppModule {
}
