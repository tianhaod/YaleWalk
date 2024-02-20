import slugify from 'slugify'
const SLUGIFY_PARAMS = { replacement: '-', lower: true, locale: 'en' }

export default {
  async nuxtServerInit({ dispatch }, ctx) {
    // INFO -> Nuxt-fire Objects can be accessed in nuxtServerInit action via this.$fire___, ctx.$fire___ and ctx.app.$fire___'

    /** Get the VERIFIED authUser on the server */
    if (ctx.res && ctx.res.locals && ctx.res.locals.user) {
      const { allClaims: claims, ...authUser } = ctx.res.locals.user

      console.info(
        'Auth User verified on server-side. User: ',
        authUser,
        'Claims:',
        claims
      )

      await dispatch('userAuthChange', {
        authUser,
        claims,
      })
    }
  },

  async userAuthChange({ commit, dispatch }, { authUser, profile }) {
    if (!authUser) {
      commit('RESET_STORE')
      return
    }
    if (authUser && authUser.getIdToken) {
      try {
        const idToken = await authUser.getIdToken(true)
        // console.info('idToken', idToken)
        if (profile) {
          commit('SET_PROFILE', { profile })
        } else {
          await dispatch('userFetchProfile', { uid: authUser.uid })
        }
      } catch (e) {
        console.error(e)
      }
    }
    commit('SET_AUTH_USER', { authUser })
    dispatch('getWalk')
  },

  checkVuexStore(ctx) {
    if (this.$fire.auth === null) {
      throw 'Vuex Store example not working - this.$fire.auth cannot be accessed.'
    }

    alert(
      'Success. Nuxt-fire Objects can be accessed in store actions via this.$fire___'
    )
  },

  async userLogout({ commit, dispatch }) {
    try {
      await this.$fire.auth.signOut()
    } catch (e) {
      // Do nothing, not properly signed in anyway.
    } finally {
      // Reset store
      commit('RESET_STORE')
    }
  },

  async getProfileInfoForFeed({ state, commit, dispatch }, { uid }) {
    try {
      let ref = this.$fire.firestore.collection('profiles').doc(uid)
      let doc = await ref.get()
      let profile = doc.data()

      if (profile === null || profile === undefined) return null
      return profile
    } catch (e) {
      console.error(e)
    } finally {
    }
  },

  async userSignIn({ dispatch, commit }, { email, password }) {
    try {
      let { user } = await this.$fire.auth.signInWithEmailAndPassword(
        email,
        password
      )
      await dispatch('userAuthChange', { authUser: user })
    } catch (e) {
      console.error(e)
    }
  },

  async userUpdateUsername({ state }, { id, displayName }) {
    try {
      await this.$fire.firestore
        .collection('profiles')
        .doc(id)
        .update({ displayName })
      return
    } catch (e) {
      console.error(e)
    }
  },

  async userFetchProfile({ state, commit, dispatch }, { uid }) {
    try {
      let ref = this.$fire.firestore.collection('profiles').doc(uid)
      let doc = await ref.get()
      let profile = doc.data()

      if (profile === null || profile === undefined) return null
      commit('SET_PROFILE', { profile })

      // listen for profile changes
      this.$fire.firestore
        .collection('profiles')
        .doc(uid)
        .onSnapshot((snapshot) => {
          console.log('profile document has been changed')

          // show alert
          if (profile.alerts && profile.alerts.length > 0) {
            dispatch('showAlert')
          }
          if (
            profile.incomingFriendRequests &&
            profile.incomingFriendRequests.length > 0
          ) {
            console.log('incoming friend triggered')

            let friend_array = profile.incomingFriendRequests
            profile.incomingFriendRequests.forEach(async (this_id) => {
              let friend_ref = this.$fire.firestore
                .collection('profiles')
                .doc(this_id)
              let friend_doc = await friend_ref.get()
              let friend_profile = friend_doc.data()
              let friend_name = friend_profile?.displayName
              commit('SET_FRIENDS', friend_name)
            })
            //profile.incomingFriendRequests.forEach(this_id => {console.log(this_id); console.log("entered")})
          }

          // show alert
          if (profile.alerts && profile.alerts.length > 0) {
            dispatch('showAlert')
          }
        })

      return profile
    } catch (e) {
      console.error(e)
    }
  },

  async userSignUp({ commit, dispatch }, { email, password, username }) {
    try {
      let newUser = await this.$fire.auth.createUserWithEmailAndPassword(
        email,
        password
      )
      let { user, profile } = await dispatch('userCreateNewProfile', {
        user: newUser.user,
        username,
      })
      await dispatch('userAuthChange', { authUser: user, profile })
    } catch (e) {
      console.error(e)
    }
  },

  async testForSlug({ dispatch }, { slug }) {
    let profilesRef = this.$fire.firestore.collection('profiles')
    let query = profilesRef.where('slug', '==', slug).limit(1)
    let snapshot = await query.get()
    return !snapshot.empty
  },

  async userSendFriendRequest({ dispatch }, { user, other }) {
    let uid = user.uid
    let userRef = this.$fire.firestore.collection('profiles').doc(uid)

    let otherId = other.uid
    let otherRef = this.$fire.firestore.collection('profiles').doc(otherId)

    if (!user.outgoingFriendRequests.includes(otherId)) {
      await userRef.update({
        outgoingFriendRequests: [...user.outgoingFriendRequests, otherId],
      })
    }
    if (!other.incomingFriendRequests.includes(uid)) {
      await otherRef.update({
        incomingFriendRequests: [...other.incomingFriendRequests, uid],
      })
    }
  },

  async userAcceptFriendRequest({ dispatch }, { user, other }) {
    let uid = user.uid
    let userRef = this.$fire.firestore.collection('profiles').doc(uid)

    let otherId = other.uid
    let otherRef = this.$fire.firestore.collection('profiles').doc(otherId)

    // from user POV: convert friend from incomingRequest --> friend
    if (!user.friends.includes(otherId)) {
      await userRef.update({
        friends: [...user.friends, otherId],
        incomingFriendRequests: user.incomingFriendRequests.filter(
          (request) => request != otherId
        ),
      })
    }

    // from friend POV: convert user from outgoingRequest --> friend
    if (!other.friends.includes(uid)) {
      await otherRef.update({
        friends: [...other.friends, uid],
        outgoingFriendRequests: other.outgoingFriendRequests.filter(
          (request) => request != uid
        ),
      })
    }

    let profile = await dispatch('userFetchProfile', { uid })
    commit('SET_FRIENDS', 'clear')
    return { user, profile }
  },

  async userDenyFriendRequest({ dispatch }, { user, other }) {
    let uid = user.uid
    let userRef = this.$fire.firestore.collection('profiles').doc(uid)

    let otherId = other.uid
    let otherRef = this.$fire.firestore.collection('profiles').doc(otherId)

    // from user POV: convert friend from incomingRequest --> friend
    await userRef.update({
      incomingFriendRequests: user.incomingFriendRequests.filter(
        (request) => request != otherId
      ),
    })

    // from friend POV: convert user from outgoingRequest --> friend
    await otherRef.update({
      outgoingFriendRequests: other.outgoingFriendRequests.filter(
        (request) => request != uid
      ),
    })

    let profile = await dispatch('userFetchProfile', { uid })
    commit('SET_FRIENDS', 'clear')
    return { user, profile }
  },

  async userCreateNewProfile({ dispatch }, { user, username }) {
    let uid = user.uid
    let ref = this.$fire.firestore.collection('profiles').doc(user.uid)
    // ensure non null values
    let displayName = user.displayName || username || user.email.split('@')[0]
    let image = user.newImage || '/images/default-profile.png'

    // create user profile reference
    await ref.set({
      email: user.email,
      image,
      uid,
      displayName,
      slug: slugify(displayName, SLUGIFY_PARAMS),
      friends: [],
      incomingFriendRequests: [],
      outgoingFriendRequests: [],
      alerts: [],
    })

    // update user object to have displayName
    if (!user.displayName) {
      await user.updateProfile({ displayName: username })
    }

    // fetch profile data
    let profile = await dispatch('userFetchProfile', { uid })
    return { user, profile }
  },

  async getWalk({ state, commit }) {
    try {
      let walksRef = this.$fire.firestore.collection('walks')
      let query = walksRef
        .where('userId', '==', state.authUser.uid)
        .where('endTime', '==', null)
      let snapshot = await query.get()

      if (snapshot.docs.length > 0) {
        console.log('Current walk found.')
        let walk = snapshot.docs[0].data()
        walk.id = snapshot.docs[0].id

        commit('SET_WALK', walk)
        commit('SET_IS_WALKING', true)
      } else {
        console.log('No current walk found.')
      }
    } catch (e) {
      console.error(e)
    }
  },

  async startWalk({ state, commit, getters }) {
    try {
      let walkRef = this.$fire.firestore.collection('walks').doc()
      let walk = getters.currentWalk
      walk = {
        ...walk,
        id: walkRef.id,
        userId: state.authUser.uid,
        startTime: new Date(),
        endTime: null,
        likes: 0,
      }
      await walkRef.set(walk)
      commit('SET_WALK', walk)
      commit('SET_IS_WALKING', true)
      console.log('Walk started.')
    } catch (e) {
      console.error(e)
    }
  },

  async getFeed({ state, commit, dispatch }, { feed = null }) {
    try {
      // TODO: get friends query
      let selfId = state?.authUser?.uid
      let friendIds = state?.profile?.friends || []

      // TODO: augment with user names and user images

      let walksRef = this.$fire.firestore.collection('walks')
      let query = walksRef
        .where('userId', 'in', [selfId, ...friendIds])
        // .where("userId", "==", state.authUser.uid)
        // .where('endTime', '==', null)
        .orderBy('endTime', 'desc')
        .limit(25)

      // Call again to paginate
      if (feed !== null) {
        const lastItem = feed[feed.length - 1]
        query.startAfter(lastItem)
      }

      let snapshot = await query.get()
      if (snapshot.empty) {
        console.log('NO WALKS')
      } else {
        let data = snapshot.docs.map((doc) => doc.data())
        // let userIds = []
        // let userProfiles = []
        let profiles = {}
        await data.forEach(async (item) => {
          item.walkCompleted = item.startTime !== null && item.endTime !== null
          let uid = item.userId
          let profile

          if (!profiles[uid]) {
            profile = await dispatch('getProfileInfoForFeed', { uid })
            profiles[uid] = profile
          } else {
            profile = profiles[uid]
          }

          if (!!profile) {
            let { Name, displayName, slug, image } = profile
            item.Name = Name
            item.slug = slug
            item.displayName = displayName
            item.image = image
          }
        })
        commit('SET_FEED', feed === null ? data : [...feed, ...data])
      }
      return snapshot.docs
    } catch (e) {
      console.error(e)
    }
  },

  async endWalk({ state, commit, getters }) {
    try {
      // update the endTime field of currentwalk to be current timestamp
      let walkRef = this.$fire.firestore
        .collection('walks')
        .doc(getters.currentWalk.id)
      let doc = await walkRef.get()

      if (doc.exists) {
        doc.ref.update({ endTime: new Date() }).then(() => {
          commit('SET_IS_WALKING', false)
          commit('SET_WALK', null)
          console.log('Walk ended.')
        })
      }
    } catch (e) {
      console.error(e)
    }
  },

  async sendAlert({ state, commit }, alert) {
    let curr_user_id = state.authUser.uid

    let curr_profile = await this.$fire.firestore
      .collection('profiles')
      .doc(curr_user_id)
      .get()
    let friends = curr_profile.data().friends
    // append the current user's id to friends' alert list

    for (const friend_id of friends) {
      let friend_profile = await this.$fire.firestore
        .collection('profiles')
        .doc(friend_id)
        .get()
      let friend_alerts = friend_profile.data().alerts
      friend_alerts.push(curr_user_id)
      this.$fire.firestore.collection('profiles').doc(friend_id).update({
        alerts: friend_alerts,
      })
    }
    console.log('Alert sent to friends.')
    commit('SET_ALERT', alert)
  },

  async showAlert({ state, commit, dispatch }) {
    // get alerter info
    let alerterId = state.profile.alerts.pop()
    let alerter = await this.$fire.firestore
      .collection('profiles')
      .doc(alerterId)
      .get()

    // TODO: display alert component / update state if necessary
    let alert = {
      title: alerter.data().displayName,
      message: 'has sent a distress signal.',
      type: 'warning',
    }

    // NOTE: this is NOT how to update state
    state.alerts.push(alert)
    commit('SET_ALERTS', state.alerts)
    commit('SET_GO_TO_NOTIFICATION_CENTER', true, { root: true }) // SHOULD open the goto notification center modal

    // Remove alert from profile.alerts
    await this.$fire.firestore
      .collection('profiles')
      .doc(state.authUser.uid)
      .update({ alerts: state.profile.alerts })
  },

  async setWalk({ commit }, walk) {
    commit('SET_WALK', walk)
  },

  async setIsWalking({ commit }, value) {
    commit('SET_IS_WALKING', value)
  },

  async searchProfiles({ state }, str) {
    // get reference to profile collection
    let profilesRef = this.$fire.firestore.collection('profiles')

    // A: displayName, B: slug, C: email
    let queryA = profilesRef
      .where('displayName', '>=', str)
      .where('displayName', '<=', str + '\uf8ff')
      .limit(25)

    let queryB = profilesRef
      .where('slug', '>=', str)
      .where('slug', '<=', str + '\uf8ff')
      .limit(25)

    let queryC = profilesRef
      .where('email', '>=', str)
      .where('email', '<=', str + '\uf8ff')
      .limit(25)

    let docs = []
    let docIds = []

    // go over snapshots
    // let snapshotA = await queryA.get()
    const snapshots = await Promise.all([
      queryA.get(),
      queryB.get(),
      queryC.get(),
    ])

    for (let i = 0; i < snapshots.length; i++) {
      const snapshot = snapshots[i]

      // Get data from not empty snapshots
      if (!snapshot.empty) {
        snapshot.docs.forEach((doc) => {
          let data = doc.data()
          if (docIds.indexOf(doc.id) < 0) {
            docIds.push(doc.id)
            docs.push({ ...data, id: doc.id })
          }
        })
      }
    }

    return docs
  },
}
