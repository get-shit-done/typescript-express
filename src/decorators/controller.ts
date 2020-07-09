import 'reflect-metadata'
import { AppRouter } from '../AppRouter'
import { Methods, Metadata } from '../enums' // eslint-disable-line no-unused-vars

export const controller = (routePrefix: string) => (target: Function) => {
  // as of es6, prototype properties are not enumerable. instead of `for in`
  // use `getOwnPropertyNames` to access all properties less constructor
  const properties = Object.getOwnPropertyNames(target.prototype).slice(1) 
  const router = AppRouter.getInstance()

  properties.forEach(property => {
    const routehandler = target.prototype[property]
    const path = Reflect.getMetadata(Metadata.path, target.prototype, property)

    // Reflect.getMethodData rerurns any type, so use enum to assign type to method
    const method: Methods = Reflect.getMetadata(Metadata.method, target.prototype, property)

    if (path) {
      router[method](routePrefix + path, routehandler)
    }
  })
}
