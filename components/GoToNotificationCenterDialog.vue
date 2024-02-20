<template>
    <v-dialog
      v-model="goToNotificationCenter"
      persistent
    >      
        <v-alert prominent type="error" dismissible
            @click.capture="handleCloseButton"
            class="mb-0"
        >
            NEW ALERT! Go to 
            <v-btn text raised outline @click="handleCloseButton">
                Notification Center
            </v-btn> 
            now!
        </v-alert>        
    </v-dialog>
</template>

<script>
import {mapState, mapActions, createNamespacedHelpers} from 'vuex'
const fb = createNamespacedHelpers('firebase')


export default {
  components: {
  },
  data: () => ({    
    dialog:false
  }),

  watch: {
    // NOTE: probably buggy due to proper state management of
    // JavaScript arrays
    alerts(newAlerts, oldAlerts) {
      if (!Array.isArray(newAlerts) || !Array.isArray(oldAlerts)) return
      if (newAlerts.length >= oldAlerts.length) {
        this.dialog = true
      }
    }
  },

  computed: {
    ...mapState(['goToNotificationCenter']),
    ...fb.mapState(['alerts', 'friendRequests']),

    
  },
  methods: {
    ...mapActions(['setGoToNotificationCenter']),
    handleCloseButton() {
        this.$router.push('/notifications')
        this.setGoToNotificationCenter(false)        
    },
    

  },

  
}
</script>