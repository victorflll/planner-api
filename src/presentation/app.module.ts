import {Module} from '@nestjs/common';
import {TripController} from './controllers/trip.controller';
import {TripService} from '../domain/services/trip.service';
import {PrismaService} from "../infrastructure/prisma.service";
import {TripRepository} from "../infrastructure/repositories/trip.repository";
import {ITripRepository} from "../domain/ports/interface.trip.repository";
import {ITripService} from "../domain/ports/interface.trip.service";

@Module({
    imports: [],
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
