export class Notification{
    constructor(  
        public notikey?:number,
        public recipient?:string,
        public notistatus?:string,
        public notimessage?:string,
        public taskKey?:number,
     ){
    }
}