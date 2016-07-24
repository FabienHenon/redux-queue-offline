import unset from 'lodash.unset'
import { INITIAL_STATE } from './initialState'
import { QUEUE_ACTION, ONLINE } from './actions'

let STATE_NAME = 'offlineQueue'
let ASYNC_PAYLOAD_FIELDS = ['payload.promise']
let TRANSACTION_ID_PREFIX = 'transaction_'

export default function middleware (stateName = STATE_NAME, asyncPayloadFields = ASYNC_PAYLOAD_FIELDS, transactionIDPrefix = TRANSACTION_ID_PREFIX) {
  STATE_NAME = stateName
  ASYNC_PAYLOAD_FIELDS = asyncPayloadFields
  TRANSACTION_ID_PREFIX = transactionIDPrefix
  let nextTransactionID = 0
  return ({ getState, dispatch }) => (next) => (action) => {
    const state = (getState() || {})[STATE_NAME] || INITIAL_STATE

    const { isOnline, queue } = state

    // check if it's a direct action for us
    if (action.type === ONLINE) {
      const result = next(action)
      queue.forEach((actionInQueue) => dispatch(actionInQueue))
      return result
    }

    const shouldQueue = (action.meta || {}).queueIfOffline

    // check if we don't need to queue the action
    if (isOnline || !shouldQueue) {
      return next(action)
    }

    let actionToQueue = {
      type: action.type,
      payload: {...action.payload},
      meta: {
        ...action.meta,
        skipOptimist: true
      }
    }

    const isOptimist = (action.meta || {}).optimist

    let transactionID

    // If the initial action was an optimist action we set a transaction ID to be sent with the action
    // as if it was a classical optimist promise
    if (isOptimist) {
      transactionID = nextTransactionID++

      actionToQueue.meta = {
        ...actionToQueue.meta,
        optimistTransactionID: TRANSACTION_ID_PREFIX + transactionID
      }
    }

    if (action.meta.skipOptimist) { // if it's a action which was in the queue already
      return next({
        type: QUEUE_ACTION,
        payload: actionToQueue
      })
    }

    dispatch({
      type: QUEUE_ACTION,
      payload: actionToQueue
    })

    let actionToDispatchNow = action
    ASYNC_PAYLOAD_FIELDS.forEach((field) => { unset(actionToDispatchNow, field) })

    if (isOptimist) {
      actionToDispatchNow.meta = {
        ...actionToDispatchNow.meta,
        forceOptimist: true,
        optimistTransactionID: TRANSACTION_ID_PREFIX + transactionID
      }
    }

    return next(actionToDispatchNow)
  }
}
