import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


interface votes{
   votes:string[];
    user:string;
}

interface nominations{
    nomination:string;
    user:string;
    name:string;
    nominationId:string
}


export type PollDocument=HydratedDocument<Poll>
@Schema()
export class Poll{
    @Prop()
    pollId:string

    @Prop()
    topic:string

    @Prop()
    admin:string

    @Prop()
    votesPerVoter:number

    @Prop()
    nominations?:nominations[]

    @Prop()
    votes?:votes[]

    @Prop()
    votingStarted?:boolean

    @Prop()
    votingEnded?:boolean

    @Prop()
    users?:string[]
}
export const PollSchema=SchemaFactory.createForClass(Poll)