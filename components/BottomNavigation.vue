<template>
  <v-bottom-navigation v-model="value" app fixed grow :input-value="true">
    <v-btn value="squads">
      <span>Squads</span>
      <v-icon>mdi-account-group</v-icon>
    </v-btn>

    <v-btn value="walk" style="opacity: 0%" x-large disabled>
      <span>Walk</span>
      <v-icon>mdi-walk</v-icon>
    </v-btn>

    <v-btn class="v-btn v-size--default" depressed @click="handleNotificationButton">
        <span value="Notifications">Notifications</span>
        <v-badge
            :content="numberOfNotifications"
            :value="numberOfNotifications"
            color="orange"
        >
            <v-icon>mdi-bell</v-icon>
        </v-badge>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import { mapState, createNamespacedHelpers, mapActions } from 'vuex'
const fb = createNamespacedHelpers('firebase')

export default {
  data: () => ({
    value: 'walk',
  }),
  computed: {
    ...mapState(['goToNotificationCenter']),
    ...fb.mapState(['alerts', 'friendRequests']),
    numberOfNotifications() {
        let a = this.alerts ? this.alerts.length : 0
        let r = this.friendRequests ? this.friendRequests.length : 0
        return a + r
    }
  },
  methods: {
    ...mapActions(['setGoToNotificationCenter']),
    handleNotificationButton() {
      // this.setGoToNotificationCenter(true)
      this.$router.push('/notifications')
    }
  },
  watch: {
    goToNotificationCenter(newState, oldState) {
      if (newState === false) return
      this.$router.push('/notifications')
    }
  }
}
</script>
