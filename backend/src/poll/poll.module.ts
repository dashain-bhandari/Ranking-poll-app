import { Module } from "@nestjs/common";
import { PollService } from "./poll.service";
import { PollController } from "./poll.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Poll, PollSchema } from "./poll.schema";


@Module({
    imports:[MongooseModule.forFeature([{name:Poll.name,schema:PollSchema}])],
   controllers:[PollController],
    providers:[PollService],
    exports:[PollService]
})
export class PollModule{

}