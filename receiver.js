let person = {
    name: "张三",
    age: 18,
    get fullName(){
        return this.name + this.age
    }
}
let proxy = new Proxy(person,{
    get(target,key,recevier){
        console.log(key)
        return Reflect.get(target,key,recevier);//映射形参，可以令person中的方法中的this自动改为代理对象proxy 
    },
    set(target,key,value,recevier){
        return Reflect.set(target,key,value,recevier);
    }, 
})
console.log(proxy.fullName) 
