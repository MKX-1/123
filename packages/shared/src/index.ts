export function isObject(value: any): boolean {
  return value !== null && typeof value === 'object'
}
export function isFunction(val: any){
    return typeof val === 'function';
}