import {Module} from '@nestjs/common';
import {join} from 'path';
import {TripController} from './controllers/trip.controller';
import {TripService} from '../domain/services/trip.service';
import {PrismaService} from "../infrastructure/prisma.service";
import {TripRepository} from "../infrastructure/repositories/trip.repository";
import {ITripRepository} from "../domain/ports/trip/interface.trip.repository";
import {ITripService} from "../domain/ports/trip/interface.trip.service";
import {HttpModule} from '@nestjs/axios';
import {IMemberRepository} from "../domain/ports/member/interface.member.repository";
import {MemberRepository} from "../infrastructure/repositories/member.repository";
import {IMemberService} from "../domain/ports/member/interface.member.service";
import {MemberService} from "../domain/services/member.service";
import {MemberController} from "./controllers/member.controller";
import {ActivityController} from './controllers/activity.controller';
import {ActivityService} from '../domain/services/activity.service';
import {IActivityRepository} from '../domain/ports/activity/interface.activity.repository';
import {IActivityService} from 'src/domain/ports/activity/interface.activity.service';
import {ActivityRepository} from '../infrastructure/repositories/activity.repository';
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import {ConfigModule, ConfigService} from '@nestjs/config';
import {IMailService} from "../domain/ports/email/interface.mail.service";
import {MailService} from "../domain/services/mail.service";
import { IAttachmentRepository } from 'src/domain/ports/attachment/interface.attachment.repository';
import { AttachmentRepository } from 'src/infrastructure/repositories/attachment.repository';
import { IAttachmentService } from 'src/domain/ports/attachment/interface.attachment.service';
import { AttachmentService } from 'src/domain/services/attachment.service';

@Module({
    imports: [MailerModule.forRootAsync({
        useFactory: async (config: ConfigService) => ({
            isGlobal: true,
            transport: {
                host: config.get('SMTP_HOST'),
                port: config.get('SMTP_PORT'),
                secure: false,
                auth: {
                    user: config.get('SMTP_USER'),
                    pass: config.get('SMTP_PWD'),
                },
            },
            defaults: {
                from: `"No Reply Plann.er" <${config.get('SMTP_USER')}>`,
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        inject: [ConfigService],
        imports: [ConfigModule]
    }), HttpModule],
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
        },
        {
            provide: IMailService,
            useClass: MailService
        },
        {
            provide: IAttachmentRepository,
            useClass: AttachmentRepository
        },
        {
            provide: IAttachmentService,
            useClass: AttachmentService
        }
    ],
    exports: [IMailService],
})
export class AppModule {
}
