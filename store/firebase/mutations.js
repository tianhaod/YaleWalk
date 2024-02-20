import Vue from 'vue'
import initialState from './state'

export default {
  RESET_STORE: (state) => {
    Object.assign(state, initialState())
  },

  SET_AUTH_USER: (state, { authUser }) => {
    // console.log('SET AUTH USER TRIGGERD', authUser)
    if (!authUser) {
      Vue.set(state, 'authUser', null)
    } else if (state.authUser === null) {
      state.authUser = {
        uid: authUser.uid,
        email: authUser.email,
        isAnonymous: authUser.isAnonymous,
      }
    } else if (authUser !== null) {
      Vue.set(state, 'authUser', authUser.uid)
      Vue.set(state.authUser, 'uid', authUser.uid)
      Vue.set(state.authUser, 'email', authUser.email)
      Vue.set(state.authUser, 'isAnonymous', authUser.isAnonymous)
    } else {
    }
    // console.log('AUTH SET', state.authUser)
  },

  SET_PROFILE: (state, { profile }) => {
    if (state.profile === null) {
      state.profile = profile
    } else {
      state.profile = { ...state.profile, ...profile }
    }
  },

  SET_IS_WALKING: (state, isWalking) => {
    Vue.set(state, 'isWalking', isWalking)
  },

  SET_WALK: (state, walk) => {
    Vue.set(state, 'walk', walk)
  },

  SET_FEED: (state, feed) => {
    Vue.set(state, 'feed', feed)
  },

  SET_SENDING_CONNECT_REQUEST: (state, bool) => {
    Vue.set(state, 'sendingConnect', bool)
  },

  SET_ALERTS: (state, alerts) => {
    Vue.set(state, 'alerts', alerts)
  },
  SET_FRIENDS: (state, friend) => {
    if (friend === "clear") {
      Vue.set(state, 'friends', [])
      return
    }
    Vue.set(state.friend, 'message', `Friend Request: ${friend} has sent a friend request!`, )
    state.friends.push(state.friend)
    Vue.set(state, 'friends', JSON.parse(JSON.stringify(state.friends)))

  }
}
