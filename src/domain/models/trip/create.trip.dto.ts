import {ApiProperty} from "@nestjs/swagger";
import {CreateMemberDto} from "../member/create.member.dto";
import {TripOwner} from "./trip.owner.model";

export class CreateTripDto {
    @ApiProperty({example: 'Florianópolis'})
    city: string;
    @ApiProperty({example: 'BR'})
    country: string;
    @ApiProperty({example: '2024-08-13 00:00:00.000Z'})
    startDate: string;
    @ApiProperty({example: '2024-08-23 00:00:00.000Z'})
    endDate: string;
    @ApiProperty({ type: TripOwner })
    owner: TripOwner
    @ApiProperty({ type: [CreateMemberDto] })
    members: CreateMemberDto[]
}