
import { Socket } from 'socket.io';

type AuthPayload={
  userId:string;
  pollId:string;
  name:string;
}
export type AuthenticatedSocket=Socket & AuthPayload
