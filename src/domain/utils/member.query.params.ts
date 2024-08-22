import {ApiProperty} from "@nestjs/swagger";

export class MemberQueryParams {
    @ApiProperty({})
    tripId: string;
}