import { HttpException, HttpStatus, Injectable, NotFoundException, Req } from "@nestjs/common";
import { createPollDto } from "./dto/createPollDto";
import { Poll } from "./poll.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { customAlphabet, nanoid } from 'nanoid'
import { JwtService } from "@nestjs/jwt";
import { NotFoundError } from "rxjs";

interface nominations {
    nomination: string;
    user: string;
    name: string;
    nominationId: string;
}


@Injectable()
export class PollService {
    constructor(@InjectModel(Poll.name) private pollModel: Model<Poll>,
        private jwtService: JwtService
    ) {

    }
    async createPoll(createPollDto: createPollDto): Promise<any> {
        try {
            const pollId = nanoid(10)
            console.log(pollId)
            const userId = nanoid(10)
            const poll = new this.pollModel({ ...createPollDto, admin: userId, pollId, users: [{userId,name:createPollDto.adminName}] });
            await poll.save();
            const token = await this.jwtService.signAsync({ pollId, userId, name: createPollDto.adminName });
            console.log(token)
            return { ...poll.toJSON(), token }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    async joinPoll({ pollId, name }: any): Promise<any> {

        try {
            const userId = nanoid(10)
            const poll = await this.pollModel.findOne({ pollId });
            if (poll) {
                const token = await this.jwtService.signAsync({ pollId, userId, name });
                console.log(token)
                return { ...poll.toJSON(), token }
            }
            else {
                throw new HttpException("Poll not found", HttpStatus.NOT_FOUND);

            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async leavePoll(pollId: string, userId: string) {
        try {
            let poll = await this.pollModel.findOne({ pollId });
            if (poll) {
                console.log(userId)
                console.log(poll.users.filter((i) => i != userId))
                poll = await this.pollModel.findOneAndUpdate({ pollId }, { users: poll.users.filter((i:any) => i.userId != userId) }, { new: true });
               console.log(poll)
                return poll.toJSON()
            }
            else {
                throw new HttpException("Poll not found", 404);
            }
        } catch (error) {
            throw new HttpException(error.message, 500)
        }
    }


    async getPoll(pollId: any): Promise<any> {

        try {

            const poll = await this.pollModel.findOne({ pollId });
            console.log(poll)
            if (poll) {
                console.log(poll)
                return poll.toJSON()
            }
            else {
                throw new HttpException("not found", HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async addUsers(userId: string, name:string,pollId: string) {
        try {
            let poll = await this.pollModel.findOne({ pollId });
            if (poll && !poll.users.find((i:any) => i.userId == userId)) {
                console.log(poll.users)
                poll = await this.pollModel.findOneAndUpdate({ pollId }, { users: [...poll.users,{ userId,name}] }, { new: true })
                console.log(poll)
                return poll.toJSON();
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    async addNomination(nomination: nominations, pollId: any): Promise<any> {
        try {
            const nominationId = nanoid(10)
            nomination = { ...nomination, nominationId: nominationId }
            let poll = await this.pollModel.findOne({ pollId });
            if (poll) {
                poll = await this.pollModel.findOneAndUpdate({ pollId }, { nominations: [...poll.nominations, nomination] }, { new: true })
                return poll.toJSON()
            }
            else {

            }
        } catch (error) {

        }

    }

    async removeNomination(nominationId: any, pollId: any) {
        try {
            let poll = await this.pollModel.findOne({ pollId });
            let newNomination = poll.nominations.filter((i) => i.nominationId != nominationId);
            poll = await this.pollModel.findOneAndUpdate({ pollId }, { nominations: newNomination }, { new: true })
            return poll.toJSON()
        } catch (error) {

        }

    }

    async startVoting(pollId: string) {
        try {
            console.log(pollId)
            let poll = await this.pollModel.findOne({ pollId: pollId });
            console.log(poll.toJSON())

            poll = await this.pollModel.findOneAndUpdate({ pollId: pollId }, { votingStarted: true }, { new: true })
            console.log(poll)
            return poll.toJSON();

        } catch (error) {
            console.log(error.message);
        }
    }

    async addVote(data: any, pollId: any) {
        try {
            console.log(data)
            let poll = await this.pollModel.findOne({ pollId });
            console.log(poll.toJSON())
            if (poll) {
                poll = await this.pollModel.findOneAndUpdate({ pollId: pollId }, { votes: [...poll.votes, { votes: data.votes, user: data.user.userId }] }, { new: true });
                console.log(poll);
                return poll.toJSON();
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    async endPoll(pollId: any) {
        try {
            let poll = await this.pollModel.findOne({ pollId });

            if (poll) {
                poll = await this.pollModel.findOneAndUpdate({ pollId }, { votingEnded: true }, { new: true })
                console.log(poll);

                return poll;
            }
        } catch (error) {
            console.log(error.message);
        }
    }
}