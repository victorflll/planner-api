import {ApiProperty} from "@nestjs/swagger";

export class MemberDto {
    @ApiProperty({ example: 'joao@email.com' })
    email: string;
    @ApiProperty({ example: false })
    status: boolean;
}