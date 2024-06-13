import { JwtService } from "@nestjs/jwt";
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { subscribe } from "diagnostics_channel";
import { Server } from "socket.io";
import { AuthenticatedSocket } from "src/poll/dto/authSocket";
import { PollService } from "src/poll/poll.service";
import { WSAuthMiddleware } from "src/socket.middleware";

let active = new Map();
@WebSocketGateway({
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})


export class socketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(

        private jwtService: JwtService,
        private pollService: PollService
    ) {

    }
    @WebSocketServer()
    server: Server

    afterInit(server: any) {
        const middle = WSAuthMiddleware(this.jwtService)
        server.use(middle)
        console.log("server initialized");
    }

    async handleConnection(client: any, ...args: any[]) {
        console.log(client.pollId);
        client.join(client.pollId);
        await this.pollService.addUsers(client.userId,client.name,client.pollId)
        console.log("client connected", client.id);
        active.set(client.userId, { userId: client.userId, name: client.name });
        console.log(active)
        console.log([...active.values()])
        this.server.to(client.pollId).emit("active", [...active.values()]);

    }

    handleDisconnect(client: any) {
        try {
            active.delete(client.userId);
            console.log(active);
            console.log('Client disconnected', client.id);
            this.server.to(client.pollId).emit('active', [...active.values()]);
        } catch (error) {
            console.error('Error in handleDisconnect:', error);
        }

    }


    @SubscribeMessage('addNomination')
    async onNomination(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: any) {
        console.log(client.pollId)
        console.log(data);
        let poll = await this.pollService.addNomination(data, client.pollId);
        console.log(poll)

        this.server.to(client.pollId).emit("pollUpdate", poll)
        //client.emit("pollUpdate",poll)
    }


    @SubscribeMessage('removeNomination')
    async removeNomination(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: any) {
        console.log(data);
        console.log(client.pollId);
        console.log(data);
        let poll: any = await this.pollService.removeNomination(data, client.pollId);
        console.log(poll)

        this.server.to(client.pollId).emit("pollUpdate", poll)
        //client.emit("pollUpdate",poll)
    }

    @SubscribeMessage('start')
    async startVoting(@MessageBody() pollId: any, @ConnectedSocket() client: AuthenticatedSocket) {
        const poll = await this.pollService.startVoting(pollId);
        console.log(poll)
       
            this.server.to(client.pollId).emit("started", poll)
        
       
    }

    @SubscribeMessage('newVote')
    async submitVote(@MessageBody() data: any, @ConnectedSocket() client: AuthenticatedSocket) {
        const poll = await this.pollService.addVote(data, client.pollId)
        console.log(poll);

        this.server.to(client.id).emit("addedVote", poll);
        this.server.to(client.pollId).emit("newVote", poll);
    }

    @SubscribeMessage('end')
    async endPoll(@MessageBody() data:any,@ConnectedSocket() client:AuthenticatedSocket){
        const poll=await this.pollService.endPoll(client.pollId)
        console.log(poll);
        this.server.to(client.pollId).emit("ended",poll.toJSON())
    }


    @SubscribeMessage('leave')
    async leave(@ConnectedSocket() client:AuthenticatedSocket){
        const poll=await this.pollService.leavePoll(client.pollId,client.userId)
        console.log(poll);
        this.server.to(client.pollId).emit("leaved",poll)
    }
}