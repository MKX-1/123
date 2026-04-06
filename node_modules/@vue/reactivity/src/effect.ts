export let activeEffect: any;
function cleanupEffect(effect: { deps: any; }){
    //执行effect之前要清理掉之前依赖的属性
    let {deps} = effect;
    for(let i = 0;i<deps.length;i++){
        let dep = deps[i];
        dep.delete(effect);//删除effect
    }
    effect.deps.length = 0;//清空依赖数组
}


export class ReactiveEffect{
    public active = true;//激活状态指的是是否要进行依赖收集
    public deps = [];
    public parent = undefined
    constructor(public fn: any,private scheduler: any){}
    run(){
        if(!this.active){
            return this.fn();//如果不激活 则直接返回函数结果
        }
        try{
            this.parent = activeEffect;
            activeEffect = this;
            cleanupEffect(this);
            return this.fn();//取响应式的属性，在这里做了依赖收集。。
        }
        finally{
            activeEffect = this.parent;
            this.parent = undefined;   
        }
    }
    //其他情况下则是激活状态下
    stop(){
        if(this.active){
            cleanupEffect(this);
            this.active = false;
        }
    };
} 

//依赖收集 将当前effect变成全局effect 在取值的时候可以拿到全局effect
export function effect(fn: any,options: any = {}){
  const _effect =  new ReactiveEffect(fn,options.scheduler);
  _effect.run();//默认执行一次
  const runner = _effect.run.bind(_effect);
  return runner; 
};

export function trackEffects(dep: { has: (arg0: any) => any; add: (arg0: any) => void; }){
    let shouldTrack = !dep.has(activeEffect);
    if(shouldTrack){
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
    }
}

const targetMap = new WeakMap();
export function track(target: any,key: any){
    if(!activeEffect){
        return;
    }
    let depsMap = targetMap.get(target);
    if(!depsMap){
        depsMap = new Map();
        targetMap.set(target,depsMap);
    }
    let dep = depsMap.get(key);
    if(!dep){
        dep = new Set();
        depsMap.set(key,dep);
    }
    trackEffects(dep);
}//依赖收集


export function trigger(target: any,key: any,newValue?: any,oldValue?: any){
   const depsMap = targetMap.get(target);
   if(!depsMap){
        return;
   }
   const dep = depsMap.get(key);
   if(dep){
     triggerEffect(dep);
   }
}//派发更新

export function triggerEffect(dep: { has: (arg0: any) => any; add: (arg0: any) => void; }){
    let effects = [...dep];
    effects.forEach((effect) => {
       if(activeEffect !== effect){
        if(effect.scheduler){
            effect.scheduler(effect);
        }
        else{
            effect.run();
        }
       }
    })
}
//