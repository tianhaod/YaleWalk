<template>
  <v-menu offset-y open-on-hover>
    <template v-slot:activator="{ on }">
      <v-btn :text="btnWithUsername" :icon="!btnWithUsername" v-on="on">
        <!-- <span class="caption text-none" v-if="btnWithUsername">{{
          username
        }}</span> -->
        <v-icon :right="btnWithUsername" class="secondary--text"
          >mdi-account</v-icon
        >
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        @click="$router.push(item.route)"
      >
        <v-list-item-icon>
          <v-icon>
            {{ item.icon }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState, createNamespacedHelpers } from 'vuex'
const fb = createNamespacedHelpers('firebase')

export default {
  name: 'UserAvatar',
  components: {},
  computed: {
    ...fb.mapState(['authUser', 'profile']),
    ...fb.mapGetters(['isAuthenticated']),
    items() {
      return this.isAuthenticated ? this.itemsLoggedIn : this.itemsLoggedOut
    },
    itemsLoggedIn() {
      return [
        { text: 'profile', route: '/user/profile', icon: 'mdi-account-box' },
        { text: 'signout', route: '/user/signout', icon: 'mdi-logout' },
      ]
    },
    itemsLoggedOut() {
      return [
        {
          text: 'signup',
          route: '/user/signup',
          icon: 'mdi-clipboard-account',
        },
        { text: 'signin', route: '/user/signin', icon: 'mdi-logout' },
      ]
    },
    username() {
      return this.profile ? this.profile.displayName : ''
    },
    btnWithUsername() {
      if (this.authUser && this.username !== '') return true
      return false
    },
  },
}
</script>
