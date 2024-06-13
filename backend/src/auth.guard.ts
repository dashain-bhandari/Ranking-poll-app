import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService:JwtService
    ){}
   async canActivate(
        context: ExecutionContext,
    ):  Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request?.headers?.authorization?.split(' ')[1]
        console.log(token);
        if (token) {
            const payload:any=await this.jwtService.verifyAsync(token)
            console.log(payload);
            request.userId=payload.userId;
             request.pollId=payload.pollId;
             request.name=payload.name;
             return true;
        }
        return false;

    }
}