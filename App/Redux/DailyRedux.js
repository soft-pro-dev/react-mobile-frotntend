import { createActions, createReducer } from 'reduxsauce'
import Immutable from 'seamless-immutable'

const { Types, Creators } = createActions({
  postSuccess: ['postSuccess'],
  fetchDaily: ['fetchDaily'],
  fetchMood: ['fetchMood']
})

export const DailyRedux = Types
export default Creators

export const INITIAL_STATE = Immutable({
  moods: {},
  fetching: false,
  results: {},
  error: null
})

export const dataObj = (state,  payload) => {
  return state.merge({ fetching: true, results: payload.postSuccess })
}

export const fetchDaily = (state) => {
  return state.merge({ fetching: false })
}

export const fetchMood = (state, payload) => {
  return state.merge({ moods: payload.fetchMood })
}

export const reducer = createReducer(INITIAL_STATE, {
  [DailyRedux.POST_SUCCESS]: dataObj,
  [DailyRedux.FETCH_DAILY]: fetchDaily,
  [DailyRedux.FETCH_MOOD]: fetchMood
})
