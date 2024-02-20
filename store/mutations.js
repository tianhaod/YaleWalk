import Vue from 'vue'

const mutations = {
  // NOTE: this is HORRIBLE design practice, but works as boilerplate / reminder.
  set(state, { k, v }) {
    Vue.set(state, k, v)
  },
  join(state, { k, v }) {
    Vue.set(state, k, Object.assign({}, state[k], v))
  },
  push(state, { k, v }) {
    state[k].push(v)
  },
  sset(state, { k, v, s }) {
    Vue.set(state[k], s, v)
  },
  splice(state, { k, i }) {
    state[k].splice(i, 1)
  },
  SET_NEW_WALK_DIALOG: (state, bool) => {
    state.newWalkDialog = bool
  },
  SET_GO_TO_NOTIFICATION_CENTER: (state, bool=true) => {
    state.goToNotificationCenter = bool
  },
}

export default mutations
