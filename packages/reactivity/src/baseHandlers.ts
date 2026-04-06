import { activeEffect } from "./effect";
import { ReactiveFlags } from "./reactive";
import { track } from "./effect";
import { trigger } from "./effect";
import { isObject } from "@vue/shared";
import { reactive } from "./reactive";
export const mutableHandlers = {
    get(target: any,key: ReactiveFlags,recevier: unknown){
        if(key === ReactiveFlags.IS_REACTIVE){
            return true
        }
        track(target,key);//依赖收集的方法，target对象 key值
        let r = Reflect.get(target,key,recevier)
        if(isObject(r)){
            return reactive(r) 
        }
        return r; 
    },//取值操作,因为响应式属性被reactive代理，所以在副作用函数effect中调用时会触发get拦截
    set(target: any,key: any,value: any,recevier: any){
        let oldValue = target[key];
        
        //set方法返回一个boolean
        const result = Reflect.set(target,key,value,recevier);
    
        if(oldValue !== value){
            trigger(target,key,value,oldValue);//触发更新
        }

        return result;
    },//赋值操作
}
