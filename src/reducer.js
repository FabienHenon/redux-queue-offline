import { INITIAL_STATE } from './initialState'
import { QUEUE_ACTION, ONLINE, OFFLINE, FORCE_OFFLINE, STOP_FORCE_OFFLINE, EMPTY_QUEUE } from './actions'

export default function reducer (state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case QUEUE_ACTION:
      return {...state, queue: state.queue.concat(action.payload)}
    case EMPTY_QUEUE:
      return {...state, queue: []}
    case ONLINE:
      return {...state, isOnline: true}
    case OFFLINE:
      return {...state, isOnline: false}
    case FORCE_OFFLINE:
      return {...state, forceOffline: true}
    case STOP_FORCE_OFFLINE:
      return {...state, forceOffline: false}
    default: return state
  }
}
