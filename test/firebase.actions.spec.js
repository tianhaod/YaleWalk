describe('actions', () => {
  // assuming firebase works, testing business logic
  it('SEND_FRIEND_REQUEST', () => {
    // mock state
    const user = {
      uid: 'SENDER',
      incomingFriendRequests: [],
      outgoingFriendRequests: [],
    }
    const other = {
      uid: 'RECIPIENT',
      incomingFriendRequests: [],
      outgoingFriendRequests: [],
    }
    const firestore = [user, other]

    // apply change
    let uid = user.uid
    let userRef = firestore.find((u) => u.uid === uid)

    let otherId = other.uid
    let otherRef = firestore.find((u) => u.uid === otherId)

    if (!user.outgoingFriendRequests.includes(otherId)) {
      userRef.outgoingFriendRequests = [...user.outgoingFriendRequests, otherId]
    }
    if (!other.incomingFriendRequests.includes(uid)) {
      otherRef.incomingFriendRequests = [...other.incomingFriendRequests, uid]
    }
    // assert result
    expect(firestore[0].uid).toMatch('SENDER')
    expect(firestore[0].incomingFriendRequests.length).toEqual(0)
    expect(firestore[0].outgoingFriendRequests.length).toEqual(1)
    expect(firestore[0].outgoingFriendRequests[0]).toMatch('RECIPIENT')

    expect(firestore[1].uid).toMatch('RECIPIENT')
    expect(firestore[1].incomingFriendRequests.length).toEqual(1)
    expect(firestore[1].outgoingFriendRequests.length).toEqual(0)
    expect(firestore[1].incomingFriendRequests[0]).toMatch('SENDER')
  }),
    it('ACCEPT_FRIEND_REQUEST', () => {
      // mock state
      const user = {
        uid: 'SENDER',
        incomingFriendRequests: ['RECIPIENT'],
        outgoingFriendRequests: [],
        friends: [],
      }
      const other = {
        uid: 'RECIPIENT',
        incomingFriendRequests: [],
        outgoingFriendRequests: ['SENDER'],
        friends: [],
      }
      const firestore = [user, other]

      // apply change
      let uid = user.uid
      let userRef = firestore.find((u) => u.uid === uid)

      let otherId = other.uid
      let otherRef = firestore.find((u) => u.uid === otherId)

      if (!user.friends.includes(otherId)) {
        userRef.friends = [...user.friends, otherId]
        userRef.incomingFriendRequests = user.incomingFriendRequests.filter(
          (request) => request != otherId
        )
      }

      if (!other.friends.includes(uid)) {
        otherRef.friends = [...other.friends, uid]
        otherRef.outgoingFriendRequests = other.outgoingFriendRequests.filter(
          (request) => request != uid
        )
      }
      // assert result
      expect(firestore[0].uid).toMatch('SENDER')
      expect(firestore[0].incomingFriendRequests.length).toEqual(0)
      expect(firestore[0].outgoingFriendRequests.length).toEqual(0)
      expect(firestore[0].friends.length).toEqual(1)
      expect(firestore[0].friends[0]).toEqual('RECIPIENT')

      expect(firestore[1].uid).toMatch('RECIPIENT')
      expect(firestore[1].incomingFriendRequests.length).toEqual(0)
      expect(firestore[1].outgoingFriendRequests.length).toEqual(0)
      expect(firestore[1].friends.length).toEqual(1)
      expect(firestore[1].friends[0]).toEqual('SENDER')
    }),
    it('DENY_FRIEND_REQUEST', () => {
      // mock state
      const user = {
        uid: 'SENDER',
        incomingFriendRequests: ['RECIPIENT'],
        outgoingFriendRequests: [],
        friends: [],
      }
      const other = {
        uid: 'RECIPIENT',
        incomingFriendRequests: [],
        outgoingFriendRequests: ['SENDER'],
        friends: [],
      }
      const firestore = [user, other]

      // apply action
      let uid = user.uid
      let userRef = firestore.find((u) => u.uid === uid)

      let otherId = other.uid
      let otherRef = firestore.find((u) => u.uid === otherId)

      if (!user.friends.includes(otherId)) {
        userRef.incomingFriendRequests = user.incomingFriendRequests.filter(
          (request) => request != otherId
        )
      }

      if (!other.friends.includes(uid)) {
        otherRef.outgoingFriendRequests = other.outgoingFriendRequests.filter(
          (request) => request != uid
        )
      }
      // assert result
      expect(firestore[0].uid).toMatch('SENDER')
      expect(firestore[0].incomingFriendRequests.length).toEqual(0)
      expect(firestore[0].outgoingFriendRequests.length).toEqual(0)
      expect(firestore[0].friends.length).toEqual(0)

      expect(firestore[1].uid).toMatch('RECIPIENT')
      expect(firestore[1].incomingFriendRequests.length).toEqual(0)
      expect(firestore[1].outgoingFriendRequests.length).toEqual(0)
      expect(firestore[1].friends.length).toEqual(0)
    })
})
