import { Task } from "./Task";

export class Chat{
    constructor(
        public chatKey?:number,
        public displayID?:string,
        public msgContent?:string,
        public msgImage?:any,
        public timeSend?:any,
        public dateSend?:any,
        public senderKey?:string,
        public receiverKey?:string,
        public taskKey?:number,
        public taskName?:string,
        public taskContentDesc?:string,
        public taskPrice?:number,
        public taskContentPic?:any,
        public msgTask?:boolean, // true or false --> show or hide task msg
        public msgStatus?:string,
        public sendFirStatus?:boolean,
        public sendSecStatus?:boolean,
        public msgBadgeNum?:number,
        public unseenMsg?:boolean,
        
    ){
    }
}