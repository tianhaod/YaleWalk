<template>
  <v-speed-dial
    v-model="isSpeedDialOpen"
    top
    fixed
    style="
      left: calc(50% - 36px);
      right: calc(50% - 36px);
      top: calc(100% - 72px - 12px);
      z-index: 4000;
    "
    direction="top"
    :open-on-hover="false"
    :transition="'slide-y-reverse-transition'"
  >
    <template v-slot:activator>
      <v-btn
        v-model="isSpeedDialOpen"
        color="pink"
        dark
        fab
        x-large
        elevation="14"
        style="z-index: 4000 !important"
      >
        <v-icon v-if="isSpeedDialOpen"> mdi-close </v-icon>
        <v-tooltip top v-else>
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on"> mdi-walk </v-icon>
          </template>
          <span>Walk!</span>
        </v-tooltip>
      </v-btn>
    </template>

    <v-tooltip v-if="!isWalking" right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          small
          color="green"
          @click="handleNewWalkClick"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Start</span>
    </v-tooltip>

    <v-tooltip v-if="isWalking" right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          small
          color="red"
          @click="handleEndWalkClick"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-stop</v-icon>
        </v-btn>
      </template>
      <span>Stop</span>
    </v-tooltip>

    <v-tooltip v-if="isWalking" right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          dark
          small
          color="warning"
          @click="handleAlertClick"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-alert</v-icon>
        </v-btn>
      </template>
      <span class="warning--text">ALERT</span>
    </v-tooltip>
  </v-speed-dial>
</template>

<script>
import { mapState, mapActions, createNamespacedHelpers } from 'vuex'
const fb = createNamespacedHelpers('firebase')

export default {
  data: () => ({
    isSpeedDialOpen: false,
  }),
  computed: {
    ...fb.mapState(['isWalking', 'walk', 'authUser']),
  },
  methods: {
    ...mapActions(['setNewWalkDialog']),
    ...fb.mapActions([
      'startWalk',
      'sendAlert',
      'endWalk',
      'setIsWalking',
      'getWalk',
      'waitForAuth',
    ]),
    handleNewWalkClick() {
      // Already walking, no new walk
      if (this.isWalking) return
      this.setNewWalkDialog(true)
    },
    handleEndWalkClick() {
      // this.setIsWalking(!this.isWalking) // remove once startWalk is done
      this.endWalk()
    },
    handleAlertClick() {
      this.sendAlert(true)
    },
  },
}
</script>
