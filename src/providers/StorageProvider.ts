import { Injectable, Inject } from '@angular/core';
import { enableProdMode } from '@angular/core';
import { Storage, StorageConfig } from '@ionic/storage';

import { User } from '../models/User';


enableProdMode()
@Injectable()
export class StorageProvider{
    username:string;
    config:StorageConfig
    

    constructor(private storage: Storage) {
        this.storage=new Storage(this.config);
    }
    
    //set must be put in a provider (this file)
    setUsername(username:string){
        this.storage.set("username",username);
    }

    //get can put in both provider and page.ts
    getUsername(){
        return this.storage.get("username").then((val)=> {
            this.username=val;      
            return this.username;

        })

    }
}