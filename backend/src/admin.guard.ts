import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { PollService } from './poll/poll.service';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private jwtService:JwtService,
        private pollService:PollService
    ){}
   async canActivate(
        context: ExecutionContext,
    ):  Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request?.headers?.authorization?.split(' ')[1]
        console.log(token)
        if (token) {
            const payload:any=await this.jwtService.verifyAsync(token)
            console.log(payload);
            request.userId=payload.userId;
             request.pollId=payload.pollId;
             request.name=payload.name;

             const poll=await this.pollService.getPoll({pollId:payload.pollId});
             console.log(poll)
             if(payload.userId==poll.admin)
                {
                    return true
                }
             return false;
        }
        return false;

    }
}