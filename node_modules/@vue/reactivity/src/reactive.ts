import { isObject } from "@vue/shared";
import { mutableHandlers } from "./baseHandlers";

export const enum ReactiveFlags{
    IS_REACTIVE = '__v_isReactive',
}//防止嵌套代理
//重写reactive
const reactiveMap = new WeakMap();//存储代理对象的映射表
export function reactive( target ){
    if( !isObject(target) ){
        return target
    }
    if(target[ReactiveFlags.IS_REACTIVE]){
        return target
    }//对这个值进行访问，target【xxx】然后就会触发get拦截，同时key就是xxx，
    //如果key是IS_REACTIVE，那么就返回true，否则就返回 Reflect.get(target,key,recevier);
    //判断是否有代理过的对象
    const exisitsProxy = reactiveMap.get(target);
    if(exisitsProxy){
        return exisitsProxy
    }
    //代理 通过代理对象操作属性 去源对象上边获取
    const proxy = new Proxy(target,mutableHandlers)

    reactiveMap.set(target,proxy)

    return proxy
};