import { isObject } from "@vue/shared";
export * from "./effect"
export * from "./reactive"
export * from "./watch"
export * from "./computed"

console.log(isObject({}))