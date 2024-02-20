<template>
  <v-btn left @click="handleClick">
    <v-img
      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
      width="20px"
      height="20px"
      contain
      class="d-flex v-icon--left"
    />
    Continue with Google
  </v-btn>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const fbHelpers = createNamespacedHelpers('firebase')
const fbMapState = fbHelpers.mapState
const fbMapActions = fbHelpers.mapActions
const fbMapGetters = fbHelpers.mapGetters

export default {
  name: 'GoogleSignIn',
  computed: {
    ...fbMapState(['authUser']),
    ...fbMapGetters(['isAuthenticated']),
    uid() {
      if (!this.authUser) return null
      return this.authUser.uid
    },
  },
  methods: {
    ...fbMapActions(['userFetchProfile', 'userCreateNewProfile']),
    handleClick: async function () {
      var anonUser = this.$fireModule.auth().currentUser

      if (anonUser === null || !this.isAuthenticated || anonUser.isAnonymous) {
        try {
          await this.signInPopup()
          // await this.handleClick()
        } catch (e) {
          if (e.code === 'auth/credential-already-in-use') {
            await this.$fireModule.auth().signInWithCredential(e.credential)
          }
        }
      }
    },
    signInPopup: async function () {      
      var provider = new this.$fireModule.auth.GoogleAuthProvider()

      const result = await this.$fireModule.auth().signInWithPopup(provider)
      // here's when you can improve what google pulls in
      var user = result.user
            
      let profile = await this.userFetchProfile({ uid: user.uid })
      if (profile === null) {
        console.log('pre')
        await this.userCreateNewProfile({
          user: user,
          username: user.displayName,
        })
        console.log('post')
      }
      this.$router.push('/user/profile')
    },
  },
}
</script>
