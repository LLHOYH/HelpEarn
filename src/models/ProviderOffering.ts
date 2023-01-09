export class ProviderOffering{
    constructor(
        public providerOfferingKey?: string,
        public providerKey?:string,
        public taskKey?:string,
        public providerStatus?:string,
        public requestorKey?:string,
    ){}
}