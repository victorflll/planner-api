import {ApiProperty} from "@nestjs/swagger";
import {ActivityDto} from "./activity.dto";

export class ActivityGroupDto {
    @ApiProperty({example: '2024-08-23'})
    dateDay: string;
    @ApiProperty({type: [ActivityDto]})
    activities: ActivityDto[];
}