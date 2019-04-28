import { resolve } from "dns";
import { rejects } from "assert";

export function sendUrlRequest(method, url, async, body){

    return new Promise((resolve, reject) => {
        let xhr;

        let reportResults = ()=>{
            if (xhr.status != 200){
                console.log('Htt request failed. method = ' + method);
                reject();
            }else{
                resolve();
            }
        }

        xhr = new XMLHttpRequest();
        if (async){
            xhr.onreadystatechange = ()=>{
                if (xhr.readyState != 4)
                    return;
            }

            reportResults();
        }

        xhr.open(method, url, async);
        xhr.send(body);

        if (!async){
            reportResults();
        }
    });

}

export class HelloWorld{
    constructor(info){
        this.info_ = info;
    }

    get Info(){
        return this.info_;
    }
}