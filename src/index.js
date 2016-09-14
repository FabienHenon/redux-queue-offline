import * as actions from './actions'
import middleware from './middleware'
import reducer from './reducer'

module.exports = {
  ONLINE: actions.ONLINE,
  OFFLINE: actions.OFFLINE,
  QUEUE_ACTION: actions.QUEUE_ACTION,
  FORCE_OFFLINE: actions.FORCE_OFFLINE,
  STOP_FORCE_OFFLINE: actions.STOP_FORCE_OFFLINE,
  EMPTY_QUEUE: actions.EMPTY_QUEUE,
  middleware,
  reducer
}
