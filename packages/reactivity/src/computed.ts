import { isFunction } from "@vue/shared";
import { activeEffect, ReactiveEffect } from "./effect";
import { trackEffects,triggerEffect } from "./effect";
class ComputedRefImpl{
    dep = new Set<ReactiveEffect>();
    effect;
    __v_isRef = true; 
    _dirty = true;
    _value = "";
    constructor(public getter: any, public setter: any){
       this.effect = new ReactiveEffect(getter,()=>{
         this._dirty = true;
         triggerEffect(this.dep);
       });
    }
    //类的属性访问器
    get value(){
        //取值后执行，并将取到的值缓存
        //如果是脏值，将_dirty设置为false
        //如果有activeEffect，意味着这个计算属性在effect中使用
        //所以需要让计算属性来收集这个effect
        if(activeEffect){
            trackEffects(this.dep);
        }
        if(this._dirty){
            this._value = this.effect.run();
            this._dirty = false;
        }
        return this._value;
    }
    set value(newValue){
        this.setter(newValue)
    }
}


export function computed(getterOrOptions: any){
     let onlyGetter = isFunction(getterOrOptions);
     let getter;
     let setter;
     if(onlyGetter){
         getter = onlyGetter;
         setter = ()=>{};
     }else{
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
     }

     return new ComputedRefImpl(getter,setter);
}
