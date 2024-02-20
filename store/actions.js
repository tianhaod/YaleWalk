const actions = {
  // NOTE: see note in mutations.js, these are corresponding actions to poor template mutations
  async set({ state, commit }, { k, v }) {
    commit('set', { k, v })
  },
  async join({ state, commit }, { k, v }) {
    commit('join', { k, v })
  },
  async push({ state, commit }, { k, v }) {
    commit('push', { k, v })
  },
  async sset({ state, commit }, { k, v, s }) {
    commit('sset', { k, v, s })
  },
  async splice({ state, commit }, { k, i }) {
    commit('splice', { k, i })
  },

  async nuxtServerInit({ dispatch, commit }, { res }) {
    if (res) {
      commit('firebase/SET_AUTH_USER', {
        authUser: res.locals && res.locals.user,
      })
    }
  },

  setNewWalkDialog({ state, commit }, bool) {
    commit('SET_NEW_WALK_DIALOG', bool)
  },
  setGoToNotificationCenter({ state, commit }, bool) {
    commit('SET_GO_TO_NOTIFICATION_CENTER', bool)
  },
}

export default actions
