import {ApiProperty} from "@nestjs/swagger";
import {TripOwner} from "./trip.owner.model";
import {IsNotEmpty, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {CreateMemberDto} from "../member/create.member.dto";

export class CreateTripDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: 'Florianópolis'})
    city: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: 'BR'})
    country: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: '2024-08-13 00:00:00.000Z'})
    startDate: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: '2024-08-23 00:00:00.000Z'})
    endDate: string;
    @ValidateNested()
    @Type(() => TripOwner)
    @ApiProperty({ type: TripOwner })
    owner: TripOwner
    @ValidateNested({ each: true })
    @Type(() => CreateMemberDto)
    @ApiProperty({ type: [CreateMemberDto] })
    members: CreateMemberDto[]
}