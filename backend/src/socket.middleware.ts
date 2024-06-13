import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';



export interface AuthSocket extends Socket {
    userId: string;
    pollId: string;
    name: string;
}
export type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void
export const WSAuthMiddleware = (jwtService: JwtService): SocketMiddleware => {
    return async (socket: AuthSocket, next) => {
        try {
            console.log("hii");

            const token= socket?.handshake?.auth?.token 
         console.log(token)
            const jwtPayload = await jwtService.verifyAsync(
               token
            )

            console.log(jwtPayload)
            if (jwtPayload) {
                socket.userId = jwtPayload.userId;
                socket.pollId = jwtPayload.pollId;
                socket.name = jwtPayload.name;
                next();
            } else {
                next({
                    name: 'Unauthorizaed',
                    message: 'Unauthorizaed',
                });
            }
        } catch (error) {
            next({
                name: 'no idea',
                message: 'no idea',
            });
        }
    }
}
