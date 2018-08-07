const Redux = function () {
}

Redux.prototype.createStore = function (reducers) {
  this.state = {}
  if (typeof reducers !== 'function') {
    [...reducers].map(reducer => {
      this.state[reducer().stateId] = reducer().state
    })
  } else {
    this.state = reducers(undefined, {})
  }

  this.reducer = reducers
  return this
}

Redux.prototype.dispatch = function (action) {
  if (typeof this.reducer === 'function') {
    this.state = this.reducer(this.state, action)
  } else {
    this.reducer.map(reducer => {
      const red = reducer().reducer
      const stateId = reducer().stateId
      const state = reducer().state
      const newState = red(this.state[stateId], action)
      if (JSON.stringify(this.state[stateId]) !== JSON.stringify(newState)) {
        this.state[stateId] = newState
      }
    })
  }
}

Redux.prototype.getState = function () {
  return this.state
}

Redux.prototype.combineReducers = function (...args) {
  return args.map((arg, index) => {
    return function () {
      return {
        stateId: index,
        state: arg(undefined, {}),
        reducer: arg
      }
    }
  })
}

// test case
const ADD = 'ADD'
const MINUS = 'MINUS'
const addCount = count => {
  return {
    type: ADD,
    count
  }
}

const addCountReducer = (state = 0, action) => {
  switch (action.type) {
    case ADD:
      return state + action.count
    default:
      return state
  }
}

const minusCountReducer = (state = 0, action) => {
  switch (action.type) {
    case MINUS:
      return state - action.count
    default:
      return state
  }
}

const reducers = new Redux().combineReducers(addCountReducer, minusCountReducer)

const store = new Redux().createStore(reducers)

console.log(store)

store.dispatch(addCount(5))

store.dispatch({type: MINUS, count: 6})

console.log(store)