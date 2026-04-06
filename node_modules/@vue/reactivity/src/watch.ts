import { isReactive } from "./reactive";
import { ReactiveEffect } from "./effect";
import { isFunction,isObject } from "@vue/shared";

function traverse(source,s = new Set()){
    if(!isObject(source)){
        return source;
    }
    if(s.has(source)){
        return source;
    }
    s.add(source);
    for (let key in source){
        traverse(source[key],s);
    }
    return source;
}



export function watch (source,cb){
    let getter;
    if(isReactive(source)){
        getter = () => traverse(source);
    }
    else if(isFunction(source)){
        getter = source;
    }
    const job = () =>{
        //内部要调用cb，也就是watch的回调方法
        let newValue = effect.run();
        cb(newValue,oldValue);
        oldValue = newValue;
    };
    const effect = new ReactiveEffect(getter,job);

    let oldValue = effect.run();//保留老值
}            

