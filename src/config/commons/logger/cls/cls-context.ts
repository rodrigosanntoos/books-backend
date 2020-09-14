/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import { ClsContextNamespace } from '.'
import { Logger } from '../../logger'

const acl = require('async-local-storage')
acl.enable()

class LocalStorageContext {
  public scope() {
    try {
      acl.scope()
    } catch (err) {
      Logger.warn(`Error while creating new log scope`)
    }
  }

  setContext(namespace: ClsContextNamespace, context: object) {
    acl.set(namespace, context)
  }

  getContext(namespace: ClsContextNamespace): object {
    return acl.get(namespace) || {}
  }

  setContextValue(key: string, value: unknown, namespace: ClsContextNamespace) {
    const context = acl.get(namespace) || {}
    context[key] = value
    this.setContext(namespace, context)
  }

  getContextValue(key: string, namespace: ClsContextNamespace): any {
    const context = acl.get(namespace) || {}
    return context[key]
  }
}

const StorageContext = new LocalStorageContext()

export { StorageContext }
