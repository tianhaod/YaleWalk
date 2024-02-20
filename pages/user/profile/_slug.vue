<template>
  <v-row row wrap>
    <v-col cols="12" sm="6" class="offset-sm-3 mb-4">
      <v-card>
        <v-col class="text-right mx-4">
          <v-card-title
            primary-title
            class="headline justify-center align-center"
          >
            @{{ uname }}
          </v-card-title>
        </v-col>

        <v-row class="mt-1 mb-4 justify-center align-center">
          <v-avatar size="120">
            <v-img
              lazy-src="https://picsum.photos/id/11/10/6"
              max-height="194"
              max-width="166"
              :src="image"
            ></v-img>
          </v-avatar>
        </v-row>

        <v-container class="d-flex justify-center align-center">
          <v-btn
            class="ma-2"
            color="indigo"
            elevation="2"
            outlined
            @click="handleConnectClick"
            :disabled="isDisabled"
            :loading="sendingConnect"
          >
            {{ connectButtonText }}
          </v-btn>
        </v-container>

        <v-card-text>
          <v-text-field
            filled
            dense
            rounded
            label="Name"
            v-model="name"
            :disabled="true"
          />
          <v-text-field
            filled
            dense
            rounded
            label="age"
            v-model="age"
            :disabled="true"
          />
          <v-text-field
            filled
            dense
            rounded
            label="location"
            v-model="location"
            :disabled="true"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Vue from 'vue'
import { mapState, createNamespacedHelpers } from 'vuex'
const fb = createNamespacedHelpers('firebase')

export default {
  components: {},
  async asyncData({ params, redirect, store }) {
    return { slug: params.slug }
  },
  data: () => ({
    other: null,
  }),
  computed: {
    ...fb.mapState(['authUser', 'profile', 'sendingConnect']),

    uname() {
      return this.other ? this.other.displayName : ''
    },
    email() {
      return this.other ? this.other.email : ''
    },
    image() {
      return this.other ? this.other.image : ''
    },
    name() {
      return this.other ? this.other.Name : ''
    },
    age() {
      return this.other ? this.other.age : ''
    },
    location() {
      return this.other ? this.other.location : ''
    },
    outgoingFriendRequests() {
      return this.other.outgoingFriendRequests
        ? this.other.outgoingFriendRequests
        : []
    },
    incomingFriendRequests() {
      return this.other.incomingFriendRequests
        ? this.other.incomingFriendRequests
        : []
    },
    connectButtonText() {
      if (this.friends()) {
        return 'Friends'
      }
      return this.userHasSentRequest() ? 'Sent' : 'Connect'
    },
    isDisabled() {
      return this.friends() || this.userHasSentRequest()
    },
  },
  methods: {
    ...fb.mapActions(['testForSlug', 'userSendFriendRequest']),
    async handleConnectClick() {
      try {
        await this.userSendFriendRequest({
          user: this.profile,
          other: this.other,
        })
      } catch (error) {
        console.log(res, error)
      } finally {
        console.log('Completed connect')
      }
    },
    async fetchUserProfile() {
      try {
        let ref = this.$fire.firestore.collection('profiles')
        let query = ref.where('slug', '==', this.slug).limit(1)
        let snapshot = await query.get()
        if (snapshot.empty) {
          return this.$router('/')
        }
        let profile = snapshot.docs[0].data()
        Vue.set(this, 'other', profile)

        return profile
      } catch (e) {}
    },
    userHasSentRequest() {
      return this.other?.incomingFriendRequests.includes(this.profile?.uid)
    },
    friends() {
      return (
        this.profile?.friends?.includes(this.other?.uid) &&
        this.other?.friends?.includes(this.profile?.uid)
      )
    },
  },
  async mounted() {
    // If current user profile, just go to profile
    if (this.slug === this.profile.slug) {
      this.$router.push('/user/profile')
    }
    // else test for user
    let slugFound = await this.testForSlug({ slug: this.slug })
    if (!slugFound) {
      this.$router.push('/')
    }
    let profile = await this.fetchUserProfile()
    this.other = profile
  },
}
</script>

<style></style>
