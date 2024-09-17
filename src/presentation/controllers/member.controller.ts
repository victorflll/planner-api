import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseFilters} from '@nestjs/common';
import {ApiBody, ApiTags} from "@nestjs/swagger";
import {IMemberService} from "../../domain/ports/member/interface.member.service";
import {CreateMemberDto} from "../../domain/models/member/create.member.dto";
import {UpdateMemberDto} from "../../domain/models/member/update.member.dto";
import {MemberQueryParams} from "../../domain/utils/member.query.params";
import {HttpExceptionMiddleware} from "../../infrastructure/middlewares/HttpExceptionMiddleware";
import {ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {CreateMemberListDto} from "../../domain/models/member/create.member.list.dto";

@ApiTags('Member')
@Controller('members')
@UseFilters(HttpExceptionMiddleware)
export class MemberController {
    constructor(private readonly memberService: IMemberService) {
    }

    @Get('/')
    async get(@Query('tripId') tripId: string) {
        return await this.memberService.get(tripId);
    }

    @Post('/')
    @ApiBody({type: CreateMemberListDto})
    create(@Body() data: CreateMemberListDto, @Query('tripId') tripId: string) {
        return this.memberService.create(data.data, tripId);
    }

    @Get('/email')
    async getByEmail(@Query('email') email: string, @Query('tripId') tripId: string) {
        return await this.memberService.getByEmail(email, tripId);
    }

    @Get('/:id')
    async getById(@Param('id') id: string, @Query('tripId') tripId: string) {
        return await this.memberService.getById(id, tripId);
    }

    @Patch('confirm/:email')
    update(
        @Body() data: UpdateMemberDto,
        @Param('email') email: string,
        @Query('tripId') tripId: string,
    ) {
        return this.memberService.confirm(email, tripId, data);
    }

    @Delete('/:id')
    delete(@Param('id') id: string, @Query('tripId') tripId: string) {
        return this.memberService.delete(id, tripId);
    }
}
