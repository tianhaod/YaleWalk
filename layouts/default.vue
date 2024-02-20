<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      clipped-left
      fixed
      app
      color="primary"
      scroll-target="#nuxt-container"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" @click="$router.push('/')" />
      <v-spacer />
      <UserAvatar />
    </v-app-bar>

    <v-main>
      <v-container id="nuxt-container" max-height="600" class="overflow-y-auto">
        <Nuxt />
      </v-container>
    </v-main>

    <WalkHome />
    <NewWalkDialog />
    <GoToNotificationCenterDialog />

    <BottomNavigation />
    <v-footer fixed app padless>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, createNamespacedHelpers } from 'vuex'
const fb = createNamespacedHelpers('firebase')

import UserAvatar from '@/components/User/UserAvatar'
import WalkHome from '@/components/WalkHome.vue'
import NewWalkDialog from '@/components/NewWalkDialog.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'
import GoToNotificationCenterDialog from '@/components/GoToNotificationCenterDialog.vue'
export default {
  name: 'DefaultLayout',
  components: {
    UserAvatar,
    WalkHome,
    BottomNavigation,
    NewWalkDialog,
    GoToNotificationCenterDialog
  },
  computed: {
    ...fb.mapState(['user']),
  },
  data: () => ({
    drawer: false,
    items: [
      {
        icon: 'mdi-rss',
        title: 'home',
        to: '/',
      },
      {
        icon: 'mdi-account-search',
        title: 'search',
        to: '/search',
      },
    ],
    title: 'Walk Home',
  }),
}
</script>
