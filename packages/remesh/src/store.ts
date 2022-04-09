import { from, Observable, Observer, Subject, Subscription } from 'rxjs'

import {
  RemeshCommand,
  RemeshCommand$,
  RemeshCommand$Context,
  RemeshCommand$Payload,
  RemeshCommandAsync,
  RemeshCommandContext,
  RemeshCommandOutput,
  RemeshCommandPayload,
  RemeshDefaultState,
  RemeshDefaultStateOptions,
  RemeshDeferState,
  RemeshDeferStateOptions,
  RemeshDomain,
  RemeshDomainContext,
  RemeshDomainDefinition,
  RemeshDomainPayload,
  RemeshEvent,
  RemeshEventOptions,
  RemeshEventPayload,
  RemeshExtern,
  RemeshExternPayload,
  RemeshInjectedContext,
  RemeshQuery,
  RemeshQueryContext,
  RemeshQueryPayload,
  RemeshState,
  RemeshStateItem,
  RemeshStateOptions,
  RemeshStatePayload,
} from './remesh'

import { createInspectorManager, InspectorType } from './inspector'

export type RemeshStore = ReturnType<typeof RemeshStore>

export const StateValuePlaceholder = Symbol('StateValuePlaceholder')

let uid = 0

export type RemeshStateStorage<T, U> = {
  id: number
  type: 'RemeshStateStorage'
  State: RemeshState<T, U>
  arg: T
  key: string
  currentState: U | typeof StateValuePlaceholder
  downstreamSet: Set<RemeshQueryStorage<any, any>>
}

export type RemeshQueryStorage<T, U> = {
  id: number
  type: 'RemeshQueryStorage'
  Query: RemeshQuery<T, U>
  arg: T
  key: string
  currentValue: U
  upstreamSet: Set<RemeshQueryStorage<any, any> | RemeshStateStorage<any, any>>
  downstreamSet: Set<RemeshQueryStorage<any, any>>
  subject: Subject<U>
  observable: Observable<U>
  refCount: number
}

export type RemeshEventStorage<T = unknown, U = T> = {
  id: number
  type: 'RemeshEventStorage'
  Event: RemeshEvent<T, U>
  subject: Subject<U>
  observable: Observable<U>
  refCount: number
}

export type RemeshCommand$Storage<T> = {
  id: number
  type: 'RemeshCommand$Storage'
  Command$: RemeshCommand$<T>
  subject: Subject<T>
  observable: Observable<T>
  subscription?: Subscription
}

export type RemeshDomainStorage<T extends RemeshDomainDefinition, Arg> = {
  id: number
  type: 'RemeshDomainStorage'
  Domain: RemeshDomain<T, Arg>
  arg: Arg
  key: string
  domain: T
  domainOutput?: BindingDomainOutput<T>
  domainPayload: RemeshDomainPayload<T, Arg>
  upstreamSet: Set<RemeshDomainStorage<any, any>>
  downstreamSet: Set<RemeshDomainStorage<any, any>>
  domainSubscriptionSet: Set<Subscription>
  upstreamSubscriptionSet: Set<Subscription>
  command$Set: Set<RemeshCommand$<any>>
  stateMap: Map<string, RemeshStateStorage<any, any>>
  queryMap: Map<string, RemeshQueryStorage<any, any>>
  eventMap: Map<RemeshEvent<any, any>, RemeshEventStorage<any, any>>
  command$Map: Map<RemeshCommand$<any>, RemeshCommand$Storage<any>>
  refCount: number
  running: boolean
}

export type RemeshExternStorage<T> = {
  id: number
  type: 'RemeshExternStorage'
  Extern: RemeshExtern<T>
  currentValue: T
}

export type RemeshStoreInspector = typeof RemeshStore

export type RemeshStoreOptions = {
  name?: string
  externs?: RemeshExternPayload<any>[]
  inspectors?: (RemeshStoreInspector | false | undefined | null)[]
}

export type BindingCommand<T extends RemeshDomainDefinition['command']> = T extends {}
  ? {
      [key in keyof T]: (...args: Parameters<T[key]>) => void
    }
  : never

export type BindingDomainOutput<T extends RemeshDomainDefinition> = Omit<T, 'command'> & {
  command: BindingCommand<T['command']>
}

type PendingClearItem =
  | RemeshStateStorage<any, any>
  | RemeshDomainStorage<any, any>
  | RemeshEventStorage<any, any>
  | RemeshQueryStorage<any, any>

export const RemeshStore = (options: RemeshStoreOptions) => {
  const inspectorManager = createInspectorManager(options)

  const dirtySet = new Set<RemeshQueryStorage<any, any>>()
  const domainStorageMap = new Map<string, RemeshDomainStorage<any, any>>()
  const pendingStorageSet = new Set<PendingClearItem>()
  const externStorageWeakMap = new WeakMap<RemeshExtern<any>, RemeshExternStorage<any>>()

  const getExternValue = <T>(Extern: RemeshExtern<T>): T => {
    for (const payload of options.externs ?? []) {
      if (payload.Extern === Extern) {
        return payload.value
      }
    }
    return Extern.default
  }

  const getExternStorage = <T>(Extern: RemeshExtern<T>): RemeshExternStorage<T> => {
    const externStorage = externStorageWeakMap.get(Extern)

    if (externStorage) {
      return externStorage
    }

    const currentValue = getExternValue(Extern)

    const currentExternStorage: RemeshExternStorage<T> = {
      id: uid++,
      type: 'RemeshExternStorage',
      Extern,
      currentValue,
    }

    externStorageWeakMap.set(Extern, currentExternStorage)

    return currentExternStorage
  }

  const getExternCurrentValue = <T>(Extern: RemeshExtern<T>): T => {
    return getExternStorage(Extern).currentValue
  }

  const storageKeyWeakMap = new WeakMap<
    RemeshQueryPayload<any, any> | RemeshStateItem<any, any> | RemeshDomainPayload<any, any>,
    string
  >()

  const getStateStorageKey = <T, U>(stateItem: RemeshStateItem<T, U>): string => {
    const key = storageKeyWeakMap.get(stateItem)

    if (key) {
      return key
    }

    const stateName = stateItem.State.stateName
    const argString = JSON.stringify(stateItem.arg) ?? ''
    const keyString = `State/${stateItem.State.stateId}/${stateName}:${argString}`

    storageKeyWeakMap.set(stateItem, keyString)

    return keyString
  }

  const getQueryStorageKey = <T, U>(queryPayload: RemeshQueryPayload<T, U>): string => {
    const key = storageKeyWeakMap.get(queryPayload)

    if (key) {
      return key
    }

    const queryName = queryPayload.Query.queryName
    const argString = JSON.stringify(queryPayload.arg) ?? ''
    const keyString = `Query/${queryPayload.Query.queryId}/${queryName}:${argString}`

    storageKeyWeakMap.set(queryPayload, keyString)

    return keyString
  }

  const getDomainStorageKey = <T extends RemeshDomainDefinition, Arg>(
    domainPayload: RemeshDomainPayload<T, Arg>,
  ): string => {
    const key = storageKeyWeakMap.get(domainPayload)

    if (key) {
      return key
    }

    const domainName = domainPayload.Domain.domainName
    const argString = JSON.stringify(domainPayload.arg) ?? ''
    const keyString = `Domain/${domainPayload.Domain.domainId}/${domainName}:${argString}`

    storageKeyWeakMap.set(domainPayload, keyString)

    return keyString
  }

  const getStorageKey = <T, U>(
    input: RemeshStateItem<T, U> | RemeshQueryPayload<T, U> | RemeshDomainPayload<T, U>,
  ): string => {
    if (input.type === 'RemeshStateItem') {
      return getStateStorageKey(input)
    } else if (input.type === 'RemeshQueryPayload') {
      return getQueryStorageKey(input)
    }
    return getDomainStorageKey(input)
  }

  const getStateFromStorage = <T, U>(storage: RemeshStateStorage<T, U>): U => {
    if (storage.currentState === StateValuePlaceholder) {
      throw new Error(`State ${storage.key} is not found`)
    }
    return storage.currentState
  }

  const stateStorageWeakMap = new WeakMap<RemeshStateItem<any, any>, RemeshStateStorage<any, any>>()

  const createStateStorage = <T, U>(stateItem: RemeshStateItem<T, U>): RemeshStateStorage<T, U> => {
    const domainStorage = getDomainStorage(stateItem.State.owner)
    const key = getStateStorageKey(stateItem)

    const currentState = stateItem.State.defer ? StateValuePlaceholder : stateItem.State.impl(stateItem.arg)

    const newStateStorage: RemeshStateStorage<T, U> = {
      id: uid++,
      type: 'RemeshStateStorage',
      State: stateItem.State,
      arg: stateItem.arg,
      key,
      currentState,
      downstreamSet: new Set(),
    }

    domainStorage.stateMap.set(key, newStateStorage)
    stateStorageWeakMap.set(stateItem, newStateStorage)

    inspectorManager.inspectStateStorage(InspectorType.StateCreated, newStateStorage)

    return newStateStorage
  }

  const restoreStateStorage = <T, U>(stateStorage: RemeshStateStorage<T, U>) => {
    const domainStorage = getDomainStorage(stateStorage.State.owner)

    if (domainStorage.stateMap.has(stateStorage.key)) {
      return
    }

    domainStorage.stateMap.set(stateStorage.key, stateStorage)
    inspectorManager.inspectStateStorage(InspectorType.StateRestored, stateStorage)
  }

  const getStateStorage = <T, U>(stateItem: RemeshStateItem<T, U>): RemeshStateStorage<T, U> => {
    const domainStorage = getDomainStorage(stateItem.State.owner)
    const key = getStateStorageKey(stateItem)
    const stateStorage = domainStorage.stateMap.get(key)

    if (stateStorage) {
      return stateStorage as RemeshStateStorage<T, U>
    }

    const cachedStorage = stateStorageWeakMap.get(stateItem)

    if (cachedStorage) {
      restoreStateStorage(cachedStorage)
      return cachedStorage
    }

    return createStateStorage(stateItem)
  }

  const eventStorageWeakMap = new WeakMap<RemeshEvent<any, any>, RemeshEventStorage<any, any>>()

  const createEventStorage = <T, U = T>(Event: RemeshEvent<T, U>): RemeshEventStorage<T, U> => {
    const domainStorage = getDomainStorage(Event.owner)

    const subject = new Subject<U>()

    const observable = new Observable<U>((subscriber) => {
      const subscription = subject.subscribe(subscriber)
      currentEventStorage.refCount += 1
      return () => {
        subscription.unsubscribe()
        currentEventStorage.refCount -= 1
        pendingStorageSet.add(currentEventStorage)
        clearPendingStorageSetIfNeeded()
      }
    })

    const cachedStorage = eventStorageWeakMap.get(Event)

    const currentEventStorage = Object.assign(cachedStorage ?? {}, {
      type: 'RemeshEventStorage',
      Event,
      subject,
      observable,
      refCount: 0,
    } as RemeshEventStorage<T, U>)

    domainStorage.eventMap.set(Event, currentEventStorage)
    eventStorageWeakMap.set(Event, currentEventStorage)

    return currentEventStorage
  }

  const getEventStorage = <T, U = T>(Event: RemeshEvent<T, U>): RemeshEventStorage<T, U> => {
    const domainStorage = getDomainStorage(Event.owner)
    const eventStorage = domainStorage.eventMap.get(Event)

    if (eventStorage) {
      return eventStorage as RemeshEventStorage<T, U>
    }

    return createEventStorage(Event)
  }

  const queryStorageWeakMap = new WeakMap<RemeshQueryPayload<any, any>, RemeshQueryStorage<any, any>>()

  const createQuery$ = <T, U>(get: () => RemeshQueryStorage<T, U>) => {
    const subject = new Subject<U>()

    const observable = new Observable<U>((subscriber) => {
      const subscription = subject.subscribe(subscriber)
      const queryStorage = get()
      queryStorage.refCount += 1

      return () => {
        subscription.unsubscribe()
        queryStorage.refCount -= 1
        pendingStorageSet.add(queryStorage)
        clearPendingStorageSetIfNeeded()
      }
    })

    return {
      subject,
      observable,
    }
  }

  const createQueryStorage = <T, U>(queryPayload: RemeshQueryPayload<T, U>): RemeshQueryStorage<T, U> => {
    const domainStorage = getDomainStorage(queryPayload.Query.owner)
    const key = getQueryStorageKey(queryPayload)

    const { subject, observable } = createQuery$(() => currentQueryStorage)
    const upstreamSet: RemeshQueryStorage<T, U>['upstreamSet'] = new Set()
    const downstreamSet: RemeshQueryStorage<T, U>['downstreamSet'] = new Set()

    const { Query } = queryPayload

    const queryContext: RemeshQueryContext = {
      get: (input) => {
        if (input.type === 'RemeshStateItem') {
          const upstreamStateStorage = getStateStorage(input)
          upstreamSet.add(upstreamStateStorage)
          return remeshInjectedContext.get(input)
        }

        if (input.type === 'RemeshQueryPayload') {
          const upstreamQueryStorage = getQueryStorage(input)
          upstreamSet.add(upstreamQueryStorage)
          return remeshInjectedContext.get(input)
        }

        return remeshInjectedContext.get(input)
      },
    }

    const currentValue = Query.impl(queryContext, queryPayload.arg)

    const currentQueryStorage: RemeshQueryStorage<T, U> = {
      id: uid++,
      type: 'RemeshQueryStorage',
      Query: queryPayload.Query,
      arg: queryPayload.arg,
      currentValue,
      key,
      upstreamSet,
      downstreamSet,
      subject,
      observable,
      refCount: 0,
    }

    for (const upstream of upstreamSet) {
      upstream.downstreamSet.add(currentQueryStorage)
    }

    domainStorage.queryMap.set(key, currentQueryStorage)
    queryStorageWeakMap.set(queryPayload, currentQueryStorage)

    inspectorManager.inspectQueryStorage(InspectorType.QueryCreated, currentQueryStorage)

    return currentQueryStorage
  }

  const restoreQueryStorage = <T, U>(queryStorage: RemeshQueryStorage<T, U>) => {
    const domainStorage = getDomainStorage(queryStorage.Query.owner)

    if (domainStorage.queryMap.has(queryStorage.key)) {
      return
    }

    const { subject, observable } = createQuery$(() => queryStorage)

    queryStorage.subject = subject
    queryStorage.observable = observable
    domainStorage.queryMap.set(queryStorage.key, queryStorage)

    for (const upstream of queryStorage.upstreamSet) {
      upstream.downstreamSet.add(queryStorage)
      if (upstream.type === 'RemeshQueryStorage') {
        restoreQueryStorage(upstream)
      } else if (upstream.type === 'RemeshStateStorage') {
        restoreStateStorage(upstream)
      } else {
        throw new Error(`Unknown upstream: ${upstream}`)
      }
    }

    inspectorManager.inspectQueryStorage(InspectorType.QueryRestored, queryStorage)
    updateQueryStorage(queryStorage)
  }

  const getQueryStorage = <T, U>(queryPayload: RemeshQueryPayload<T, U>): RemeshQueryStorage<T, U> => {
    const domainStorage = getDomainStorage(queryPayload.Query.owner)
    const key = getQueryStorageKey(queryPayload)
    const queryStorage = domainStorage.queryMap.get(key)

    if (queryStorage) {
      return queryStorage
    }

    const cachedStorage = queryStorageWeakMap.get(queryPayload)

    if (cachedStorage) {
      restoreQueryStorage(cachedStorage)
      return cachedStorage
    }

    return createQueryStorage(queryPayload)
  }

  const command$StorageWeakMap = new WeakMap<RemeshCommand$<any>, RemeshCommand$Storage<any>>()

  const createCommand$Storage = <T>(Command$: RemeshCommand$<T>): RemeshCommand$Storage<T> => {
    const domainStorage = getDomainStorage(Command$.owner)
    const subject = new Subject<T>()
    const observable = subject.asObservable()

    const currentCommand$Storage: RemeshCommand$Storage<T> = {
      id: uid++,
      type: 'RemeshCommand$Storage',
      Command$,
      subject,
      observable,
    }

    domainStorage.command$Map.set(Command$, currentCommand$Storage)
    command$StorageWeakMap.set(Command$, currentCommand$Storage)

    return currentCommand$Storage
  }

  const getCommand$Storage = <T>(Command$: RemeshCommand$<T>): RemeshCommand$Storage<T> => {
    const domainStorage = getDomainStorage(Command$.owner)
    const command$Storage = domainStorage.command$Map.get(Command$)

    if (command$Storage) {
      return command$Storage
    }

    const cachedStorage = command$StorageWeakMap.get(Command$)

    if (cachedStorage) {
      const subject = new Subject<T>()
      const observable = subject.asObservable()

      cachedStorage.subject = subject
      cachedStorage.observable = observable
      cachedStorage.subscription = undefined
      domainStorage.command$Map.set(Command$, cachedStorage)

      return cachedStorage
    }

    return createCommand$Storage(Command$)
  }

  const domainStorageWeakMap = new WeakMap<RemeshDomainPayload<any, any>, RemeshDomainStorage<any, any>>()

  const createDomainStorage = <T extends RemeshDomainDefinition, Arg>(
    domainPayload: RemeshDomainPayload<T, Arg>,
  ): RemeshDomainStorage<T, Arg> => {
    const key = getDomainStorageKey(domainPayload)

    let isDomainInited = false

    const upstreamSet: RemeshDomainStorage<T, Arg>['upstreamSet'] = new Set()
    const command$Set: RemeshDomainStorage<T, Arg>['command$Set'] = new Set()

    const domainContext: RemeshDomainContext = {
      state: (
        options:
          | RemeshStateOptions<unknown, unknown>
          | RemeshDefaultStateOptions<unknown>
          | RemeshDeferStateOptions<unknown, unknown>,
      ): any => {
        if (isDomainInited) {
          throw new Error(`Unexpected calling domain.state(..) asynchronously`)
        }

        if ('default' in options) {
          const DefaultState = RemeshDefaultState(options)
          DefaultState.owner = domainPayload
          DefaultState.Query.owner = domainPayload
          return DefaultState
        }

        if (!('impl' in options)) {
          const DeferState = RemeshDeferState(options)
          DeferState.owner = domainPayload
          DeferState.Query.owner = domainPayload
          return DeferState
        }

        const State = RemeshState(options)
        State.owner = domainPayload
        State.Query.owner = domainPayload
        return State
      },
      query: (options) => {
        if (isDomainInited) {
          throw new Error(`Unexpected calling domain.query(..) asynchronously`)
        }
        const Query = RemeshQuery(options)
        Query.owner = domainPayload
        return Query
      },
      event: (options: { name: string } | RemeshEventOptions<any, any>) => {
        if (isDomainInited) {
          throw new Error(`Unexpected calling domain.event(..) asynchronously`)
        }
        const Event = RemeshEvent(options)
        Event.owner = domainPayload
        return Event as RemeshEvent<any, any>
      },
      command: (options) => {
        if (isDomainInited) {
          throw new Error(`Unexpected calling domain.command(..) asynchronously`)
        }
        const Command = RemeshCommand(options)
        Command.owner = domainPayload
        return Command
      },
      command$: (options) => {
        if (isDomainInited) {
          throw new Error(`Unexpected calling domain.command$(..) asynchronously`)
        }
        const Command$ = RemeshCommand$(options)
        Command$.owner = domainPayload
        command$Set.add(Command$)
        return Command$
      },
      commandAsync: (options) => {
        if (isDomainInited) {
          throw new Error(`Unexpected calling domain.command$(..) asynchronously`)
        }
        const Command$ = RemeshCommandAsync(options)
        Command$.owner = domainPayload
        command$Set.add(Command$)
        return Command$
      },
      getDomain: (UpstreamDomain) => {
        const upstreamDomainStorage = getDomainStorage(UpstreamDomain)

        upstreamSet.add(upstreamDomainStorage)

        return upstreamDomainStorage.domain
      },
      getExtern: (Extern) => {
        return getExternCurrentValue(Extern)
      },
    }

    const domain = domainPayload.Domain.impl(domainContext, domainPayload.arg)

    isDomainInited = true
    const currentDomainStorage: RemeshDomainStorage<T, Arg> = {
      id: uid++,
      type: 'RemeshDomainStorage',
      Domain: domainPayload.Domain,
      arg: domainPayload.arg,
      domain,
      domainPayload,
      key,
      command$Set,
      upstreamSet,
      downstreamSet: new Set(),
      upstreamSubscriptionSet: new Set(),
      domainSubscriptionSet: new Set(),
      stateMap: new Map(),
      queryMap: new Map(),
      eventMap: new Map(),
      command$Map: new Map(),
      refCount: 0,
      running: false,
    }

    domainStorageMap.set(key, currentDomainStorage)
    domainStorageWeakMap.set(domainPayload, currentDomainStorage)

    inspectorManager.inspectDomainStorage(InspectorType.DomainCreated, currentDomainStorage)

    for (const upstreamDomainStorage of upstreamSet) {
      upstreamDomainStorage.downstreamSet.add(currentDomainStorage)
    }

    return currentDomainStorage
  }

  const getDomainStorage = <T extends RemeshDomainDefinition, Arg>(
    domainPayload: RemeshDomainPayload<T, Arg>,
  ): RemeshDomainStorage<T, Arg> => {
    const key = getDomainStorageKey(domainPayload)
    const domainStorage = domainStorageMap.get(key)

    if (domainStorage) {
      return domainStorage
    }

    const cachedStorage = domainStorageWeakMap.get(domainPayload)

    if (cachedStorage) {
      cachedStorage.running = false
      domainStorageMap.set(cachedStorage.key, cachedStorage)

      for (const upstreamDomainStorage of cachedStorage.upstreamSet) {
        upstreamDomainStorage.downstreamSet.add(cachedStorage)
      }

      inspectorManager.inspectDomainStorage(InspectorType.DomainRestored, cachedStorage)
      return cachedStorage
    }

    return createDomainStorage(domainPayload)
  }

  const clearQueryStorage = <T, U>(queryStorage: RemeshQueryStorage<T, U>) => {
    const domainStorage = getDomainStorage(queryStorage.Query.owner)

    if (!domainStorage.queryMap.has(queryStorage.key)) {
      return
    }

    domainStorage.queryMap.delete(queryStorage.key)

    inspectorManager.inspectQueryStorage(InspectorType.QueryDestroyed, queryStorage)

    for (const upstreamStorage of queryStorage.upstreamSet) {
      upstreamStorage.downstreamSet.delete(queryStorage)

      if (upstreamStorage.type === 'RemeshQueryStorage') {
        clearQueryStorageIfNeeded(upstreamStorage)
      } else if (upstreamStorage.type === 'RemeshStateStorage') {
        clearStateStorageIfNeeded(upstreamStorage)
      } else {
        throw new Error(`Unknown upstream in clearQueryStorageIfNeeded(..): ${upstreamStorage}`)
      }
    }

    queryStorage.subject.complete()
  }

  const clearQueryStorageIfNeeded = <T, U>(queryStorage: RemeshQueryStorage<T, U>) => {
    if (queryStorage.refCount !== 0) {
      return
    }

    if (queryStorage.downstreamSet.size !== 0) {
      return
    }

    clearQueryStorage(queryStorage)
  }

  const clearStateStorage = <T, U>(stateStorage: RemeshStateStorage<T, U>) => {
    const domainStorage = getDomainStorage(stateStorage.State.owner)

    if (!domainStorage.stateMap.has(stateStorage.key)) {
      return
    }

    inspectorManager.inspectStateStorage(InspectorType.StateDestroyed, stateStorage)
    domainStorage.stateMap.delete(stateStorage.key)
    stateStorage.downstreamSet.clear()
  }

  const clearStateStorageIfNeeded = <T, U>(stateStorage: RemeshStateStorage<T, U>) => {
    if (stateStorage.downstreamSet.size !== 0) {
      return
    }

    clearStateStorage(stateStorage)
  }

  const clearEventStorage = <T, U>(eventStorage: RemeshEventStorage<T, U>) => {
    const domainStorage = getDomainStorage(eventStorage.Event.owner)

    eventStorage.subject.complete()
    domainStorage.eventMap.delete(eventStorage.Event)
  }

  const clearEventStorageIfNeeded = <T, U>(eventStorage: RemeshEventStorage<T, U>) => {
    if (eventStorage.refCount !== 0) {
      return
    }

    clearEventStorage(eventStorage)
  }

  const clearCommand$Storage = <T>(command$Storage: RemeshCommand$Storage<T>) => {
    const domainStorage = getDomainStorage(command$Storage.Command$.owner)

    command$Storage.subject.complete()
    command$Storage.subscription?.unsubscribe()
    command$Storage.subscription = undefined

    domainStorage.command$Map.delete(command$Storage.Command$)
  }

  const clearDomainStorage = <T extends RemeshDomainDefinition, Arg>(domainStorage: RemeshDomainStorage<T, Arg>) => {
    inspectorManager.inspectDomainStorage(InspectorType.DomainDestroyed, domainStorage)

    clearSubscriptionSet(domainStorage.domainSubscriptionSet)
    clearSubscriptionSet(domainStorage.upstreamSubscriptionSet)

    for (const eventStorage of domainStorage.eventMap.values()) {
      clearEventStorage(eventStorage)
    }

    for (const queryStorage of domainStorage.queryMap.values()) {
      clearQueryStorage(queryStorage)
    }

    for (const stateStorage of domainStorage.stateMap.values()) {
      clearStateStorage(stateStorage)
    }

    for (const command$Storage of domainStorage.command$Map.values()) {
      clearCommand$Storage(command$Storage)
    }

    domainStorage.upstreamSubscriptionSet.clear()
    domainStorage.domainSubscriptionSet.clear()
    domainStorage.downstreamSet.clear()
    domainStorage.stateMap.clear()
    domainStorage.queryMap.clear()
    domainStorage.eventMap.clear()

    domainStorage.running = false

    domainStorageMap.delete(domainStorage.key)

    for (const upstreamDomainStorage of domainStorage.upstreamSet) {
      upstreamDomainStorage.downstreamSet.delete(domainStorage)
      clearDomainStorageIfNeeded(upstreamDomainStorage)
    }
  }

  const clearDomainStorageIfNeeded = <T extends RemeshDomainDefinition, Arg>(
    domainStorage: RemeshDomainStorage<T, Arg>,
  ) => {
    if (domainStorage.refCount !== 0) {
      return
    }

    if (domainStorage.downstreamSet.size !== 0) {
      return
    }

    if (domainStorage.domainSubscriptionSet.size !== 0) {
      return
    }

    clearDomainStorage(domainStorage)
  }

  const getCurrentState = <T, U>(stateItem: RemeshStateItem<T, U>): U => {
    const stateStorage = getStateStorage(stateItem)

    return getStateFromStorage(stateStorage)
  }

  const getCurrentQueryValue = <T, U>(queryPayload: RemeshQueryPayload<T, U>): U => {
    const queryStorage = getQueryStorage(queryPayload)

    return queryStorage.currentValue
  }

  const remeshInjectedContext: RemeshInjectedContext = {
    get: (input) => {
      if (input.type === 'RemeshStateItem') {
        return getCurrentState(input)
      }

      if (input.type === 'RemeshQueryPayload') {
        return getCurrentQueryValue(input)
      }

      throw new Error(`Unexpected input in ctx.get(..): ${input}`)
    },
    fromEvent: (Event) => {
      const eventStorage = getEventStorage(Event)
      return eventStorage.observable
    },
    fromQuery: (queryPayload) => {
      const queryStorage = getQueryStorage(queryPayload)
      return queryStorage.observable
    },
  }

  const updateQueryStorage = <T, U>(queryStorage: RemeshQueryStorage<T, U>) => {
    const { Query } = queryStorage

    for (const upstream of queryStorage.upstreamSet) {
      upstream.downstreamSet.delete(queryStorage)
      if (upstream.downstreamSet.size === 0) {
        pendingStorageSet.add(upstream)
      }
    }

    queryStorage.upstreamSet.clear()

    const queryContext: RemeshQueryContext = {
      get: (input) => {
        if (input.type === 'RemeshStateItem') {
          const stateItem = input
          const upstreamStateStorage = getStateStorage(stateItem)
          queryStorage.upstreamSet.add(upstreamStateStorage)
          upstreamStateStorage.downstreamSet.add(queryStorage)
          return remeshInjectedContext.get(stateItem)
        }

        if (input.type === 'RemeshQueryPayload') {
          const queryPayload = input
          const upstreamQueryStorage = getQueryStorage(queryPayload)
          queryStorage.upstreamSet.add(upstreamQueryStorage)
          upstreamQueryStorage.downstreamSet.add(queryStorage)
          return remeshInjectedContext.get(queryPayload)
        }

        return remeshInjectedContext.get(input)
      },
    }

    const newValue = Query.impl(queryContext, queryStorage.arg)

    const isEqual = Query.compare(queryStorage.currentValue, newValue)

    if (isEqual) {
      return
    }

    queryStorage.currentValue = newValue

    dirtySet.add(queryStorage)

    inspectorManager.inspectQueryStorage(InspectorType.QueryUpdated, queryStorage)

    /**
     * updateQueryStorage may update upstream.downstreamSet
     * so it should be converted to an array for avoiding infinite loop
     */
    for (const downstream of [...queryStorage.downstreamSet]) {
      updateQueryStorage(downstream)
    }
  }

  const clearPendingStorageSetIfNeeded = () => {
    if (pendingStorageSet.size === 0) {
      return
    }

    const storageList = [...pendingStorageSet]

    pendingStorageSet.clear()

    for (const storage of storageList) {
      if (storage.type === 'RemeshDomainStorage') {
        clearDomainStorageIfNeeded(storage)
      } else if (storage.type === 'RemeshEventStorage') {
        clearEventStorageIfNeeded(storage)
      } else if (storage.type === 'RemeshQueryStorage') {
        clearQueryStorageIfNeeded(storage)
      } else if (storage.type === 'RemeshStateStorage') {
        clearStateStorageIfNeeded(storage)
      }
    }

    clearPendingStorageSetIfNeeded()
  }

  const clearDirtySetIfNeeded = () => {
    if (dirtySet.size === 0) {
      return
    }

    const queryStorageList = [...dirtySet]

    dirtySet.clear()

    for (const queryStorage of queryStorageList) {
      if (!dirtySet.has(queryStorage)) {
        queryStorage.subject.next(queryStorage.currentValue)
      }
    }

    /**
     * recursively consuming dirty set unit it become empty.
     */
    clearDirtySetIfNeeded()
  }

  const commit = () => {
    clearDirtySetIfNeeded()
  }

  const handleStatePayload = <T, U>(statePayload: RemeshStatePayload<T, U>) => {
    const stateStorage = getStateStorage(statePayload.stateItem)

    if (stateStorage.currentState !== StateValuePlaceholder) {
      const isEqual = statePayload.stateItem.State.compare(stateStorage.currentState, statePayload.newState)

      if (isEqual) {
        return
      }
    }

    stateStorage.currentState = statePayload.newState

    inspectorManager.inspectStateStorage(InspectorType.StateUpdated, stateStorage)

    /**
     * updateQueryStorage may update upstream.downstreamSet
     * so it should be converted to an array for avoiding infinite loop
     */
    for (const downstream of [...stateStorage.downstreamSet]) {
      updateQueryStorage(downstream)
    }
  }

  const handleEventPayload = <T, U = T>(eventPayload: RemeshEventPayload<T, U>) => {
    const { Event, arg } = eventPayload
    const eventStorage = getEventStorage(Event)

    inspectorManager.inspectEventEmitted(InspectorType.EventEmitted, eventPayload)

    if (Event.impl) {
      const eventContext = {
        get: remeshInjectedContext.get,
      }
      const data = Event.impl(eventContext, arg)
      eventStorage.subject.next(data)
    } else {
      eventStorage.subject.next(arg as unknown as U)
    }
  }

  const handleCommandPayload = <T>(commandPayload: RemeshCommandPayload<T>) => {
    inspectorManager.inspectCommandReceived(InspectorType.CommandReceived, commandPayload)

    const { Command, arg } = commandPayload
    const commandContext: RemeshCommandContext = {
      get: remeshInjectedContext.get,
    }

    const commandOutput = Command.impl(commandContext, arg)
    handleCommandOutput(commandOutput)
  }

  const handleSubscription = (subscriptionSet: Set<Subscription>, subscription: Subscription) => {
    subscriptionSet.add(subscription)

    subscription.add(() => {
      subscriptionSet.delete(subscription)
    })
  }

  const initCommand$IfNeeded = <T>(Command$: RemeshCommand$<T>) => {
    const command$Storage = getCommand$Storage(Command$)

    if (command$Storage.subscription) {
      return
    }

    const command$Context: RemeshCommand$Context = {
      get: remeshInjectedContext.get,
      fromEvent: remeshInjectedContext.fromEvent,
      fromQuery: remeshInjectedContext.fromQuery,
    }

    const command$ = Command$.impl(command$Context, command$Storage.observable)

    const subscription = command$.subscribe((commandOutput) => {
      handleCommandOutput(commandOutput)
      commit()
    })

    command$Storage.subscription = subscription
  }

  const handleCommandOutput = (commandOutput: RemeshCommandOutput) => {
    if (commandOutput === null) {
      return
    }

    if (Array.isArray(commandOutput)) {
      for (const item of commandOutput) {
        handleCommandOutput(item)
      }
      return
    }

    if (commandOutput.type === 'RemeshCommandPayload') {
      handleCommandPayload(commandOutput)
      return
    } else if (commandOutput.type === 'RemeshEventPayload') {
      handleEventPayload(commandOutput)
      return
    } else if (commandOutput.type === 'RemeshStateSetterPayload') {
      handleStatePayload(commandOutput)
      return
    } else if (commandOutput.type === 'RemeshCommand$Payload') {
      handleCommand$Payload(commandOutput)
      return
    }

    throw new Error(`Unknown command output of ${commandOutput}`)
  }

  const handleCommand$Payload = <T>(command$Payload: RemeshCommand$Payload<T>) => {
    inspectorManager.inspectCommand$Received(InspectorType.Command$Received, command$Payload)

    const { Command$, arg } = command$Payload
    const command$Storage = getCommand$Storage(Command$)

    initCommand$IfNeeded(Command$)
    command$Storage.subject.next(arg)
  }

  const addDomainSubscription = (domainStorage: RemeshDomainStorage<any, any>, domainSubscription: Subscription) => {
    handleSubscription(domainStorage.domainSubscriptionSet, domainSubscription)

    domainSubscription.add(() => {
      pendingStorageSet.add(domainStorage)
      clearPendingStorageSetIfNeeded()
    })
  }

  const subscribeQuery = <T, U>(
    queryPayload: RemeshQueryPayload<T, U>,
    subscriber: ((data: U) => unknown) | Partial<Observer<U>>,
  ): Subscription => {
    const queryStorage = getQueryStorage(queryPayload)
    const subscription =
      typeof subscriber === 'function'
        ? queryStorage.observable.subscribe(subscriber)
        : queryStorage.observable.subscribe(subscriber)

    return subscription
  }

  const subscribeEvent = <T, U = T>(Event: RemeshEvent<T, U>, subscriber: (event: U) => unknown) => {
    const eventStorage = getEventStorage(Event)
    const subscription = eventStorage.observable.subscribe(subscriber)

    return subscription
  }

  const getBindingCommand = <T extends RemeshDomainDefinition>(domain: T) => {
    const command = {}

    for (const key in domain.command) {
      const Command = domain.command[key]
      command[key] = (arg: any) => sendCommand(Command(arg))
    }

    return command as BindingCommand<T['command']>
  }

  const getDomain = <T extends RemeshDomainDefinition, Arg>(
    domainPayload: RemeshDomainPayload<T, Arg>,
  ): BindingDomainOutput<T> => {
    const domainStorage = getDomainStorage(domainPayload)

    if (domainStorage.domainOutput) {
      return domainStorage.domainOutput
    }

    const domain = domainStorage.domain
    const command = getBindingCommand(domain)

    const domainOutput = {
      ...domain,
      command,
    }

    domainStorage.domainOutput = domainOutput

    return domainOutput
  }

  const initCommand$Set = (command$Set: RemeshDomainStorage<any, any>['command$Set']) => {
    for (const Command$ of command$Set) {
      initCommand$IfNeeded(Command$)
    }
  }

  const runDomainStorageIfNeeded = <T extends RemeshDomainDefinition, Arg>(
    domainStorage: RemeshDomainStorage<T, Arg>,
  ) => {
    if (domainStorage.running) {
      return
    }

    domainStorage.running = true

    for (const upstreamDomainStorage of domainStorage.upstreamSet) {
      const upstreamDomainSubscription = subscribeDomain(upstreamDomainStorage.domainPayload)
      handleSubscription(domainStorage.upstreamSubscriptionSet, upstreamDomainSubscription)
    }

    initCommand$Set(domainStorage.command$Set)
  }

  const subscribeDomain = <T extends RemeshDomainDefinition, Arg>(
    domainPayload: RemeshDomainPayload<T, Arg>,
  ): Subscription => {
    const domainStorage = getDomainStorage(domainPayload)
    const domainSubscription = new Subscription()

    addDomainSubscription(domainStorage, domainSubscription)
    runDomainStorageIfNeeded(domainStorage)

    return domainSubscription
  }

  const destroy = () => {
    inspectorManager.destroyInspectors()

    for (const domainStorage of domainStorageMap.values()) {
      clearDomainStorage(domainStorage)
    }
    domainStorageMap.clear()
    dirtySet.clear()
  }

  const emitEvent = <T, U>(eventPayload: RemeshEventPayload<T, U>) => {
    handleEventPayload(eventPayload)
  }

  const sendCommand = <T>(input: RemeshCommandPayload<T> | RemeshCommand$Payload<T>) => {
    if (input.type === 'RemeshCommandPayload') {
      handleCommandPayload(input)
      commit()
    } else if (input.type === 'RemeshCommand$Payload') {
      handleCommand$Payload(input)
    }
  }

  return {
    name: options.name,
    getDomain,
    query: getCurrentQueryValue,
    emitEvent,
    sendCommand,
    destroy,
    subscribeQuery,
    subscribeEvent,
    subscribeDomain,
    getKey: getStorageKey,
  }
}

const clearSubscriptionSet = (subscriptionSet: Set<Subscription>) => {
  for (const subscription of subscriptionSet) {
    subscription.unsubscribe()
  }
}