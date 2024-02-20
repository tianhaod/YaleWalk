import Vuex from 'vuex'
import actions from './actions.js'
import getters from './getters.js'
import mutations from './mutations.js'
import state from './state.js'

export const strict = false

export default {
  namespaced: true,
  mutations,
  actions,
  getters,
  state,
}
