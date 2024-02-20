const getters = {
  isAuthenticated: (state) => !!state.authUser && state.authUser.id !== null,
  isAnonymous: (state, getters) =>
    getters.isAuthenticated && state.authUser.isAnonymous === true,
  currentWalk: (state) => state.walk,
}

export default getters
