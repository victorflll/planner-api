import {ApiProperty} from "@nestjs/swagger";

export class CreateMemberDto {
    @ApiProperty({ example: 'joao@email.com' })
    email: string;
    @ApiProperty({ example: false })
    owner: boolean;
}