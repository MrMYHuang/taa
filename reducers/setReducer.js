export default function reducer(state = {
}, action) {
  var newState = { ...state }
  var key = action.key
  var val = action.val
  newState[key] = val
  switch (action.type) {
    case "SET_KEY_VAL": {
      return newState
    }
  }
  return state
}
