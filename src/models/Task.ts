export class Task{
    constructor(
        public taskKey?:number,
        public taskName?:string,
        public contentDesc?:string,
        public location?:string,
        public latitude?:string,
        public longtitude?:string,
        public helperNum?:number,
        public completeDate?:string,
        public preferGender?:string,
        public skillsNeeded?:string,
        public contentPic?:any,
        public price?:number,
        public category?:string,
        public timePosted?:any,
        public status?:string,
        public requestor?:any,
        public provider?:any[],
        public providerOffering?:any[],
        public premiumStatus?:boolean
    ){

    }
}