const state = () => ({
  authUser: null,
  profile: null,
  walk: null,
  isWalking: false,
  feed: null,
  sendingConnect: false,
  alerts: [],
  friends : [],
  friend: {
    title: 'Friend request',
    message: 'request',
    type: 'info'
  }
})

export default state
