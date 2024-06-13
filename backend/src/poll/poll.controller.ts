import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { PollService } from "./poll.service";
import { createPollDto } from "./dto/createPollDto";
import { joinPollDto } from "./dto/joinPollDto";
import { AuthGuard } from "src/auth.guard";
import { AdminGuard } from "src/admin.guard";

@Controller('polls')
export class PollController {
  constructor(private pollService: PollService) {

  }
  @Post()
  async createPoll(@Body() input: createPollDto) {
    return this.pollService.createPoll(input)
  }

  @Post('join')
  async joinPoll(@Body() input: joinPollDto) {
    return this.pollService.joinPoll(input)
  }

  @Post('leave')
  @UseGuards(AuthGuard)
  async leavePoll(@Request() req: any) {
    return this.pollService.leavePoll(req.pollId,req.userId)
  } 


  @Get()
  @UseGuards(AuthGuard)
  // @UseGuards(AdminGuard)
  async getInfo(@Request() req: any) {
    let poll= await this.pollService.getPoll(req.pollId)
    console.log(poll)
    return {...poll,name:req.name,userId:req.userId}
  }

@Get('token')
@UseGuards(AuthGuard)
async getToken(@Request() req: any){
return {pollId:req.pollId,name:req.name,userId:req.userId}
}

}