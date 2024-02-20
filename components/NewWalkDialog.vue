<template>
  <v-dialog v-model="newWalkDialog" persistent>
    <v-card>
      <v-card-title>
        New Walk
        <v-spacer></v-spacer>
        <v-btn color="error" icon @click="handleCloseButton">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-stepper v-model="stepper" vertical flat>
        <v-stepper-step
          :complete="stepper > 1"
          step="1"
          editable
          edit-icon="mdi-check"
        >
          New walk to {{ walkTitle }}
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-form v-model="valid">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="walkTitle"
                    :rules="walkTitleRules"
                    :counter="50"
                    required
                    label="Title"
                    hint="Heading home!"
                    persistent-hint
                    filled
                    clearable
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="walkSubtitle"
                    :rules="walkSubtitleRules"
                    :counter="50"
                    label="Subtitle"
                    hint="You would not believe the day it's been"
                    persistent-hint
                    filled
                    clearable
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          <v-btn color="primary" @click="stepper = stepper + 1">
            Continue
          </v-btn>
          <v-btn
            v-if="stepper > 1"
            text
            @click="stepper = stepper <= 1 ? 1 : stepper - 1"
          >
            Back
          </v-btn>
        </v-stepper-content>

        <v-stepper-step
          :complete="stepper > 2"
          step="2"
          editable
          edit-icon="mdi-check"
          @click="stepper = 2"
        >
          Starting location: {{ startingString }}
        </v-stepper-step>
        <v-stepper-content step="2">
          <SearchLocation
            :apiKey="apiKey"
            @input="handleLocation($event, 1)"
            @query="startingString = $event"
          />

          <v-btn color="primary" @click="stepper += 1"> Continue </v-btn>
          <v-btn
            v-if="stepper > 1"
            text
            @click="stepper = stepper <= 1 ? 1 : stepper - 1"
          >
            Back
          </v-btn>
        </v-stepper-content>

        <v-stepper-step
          :complete="stepper > 3"
          step="3"
          editable
          edit-icon="mdi-check"
          @click="stepper = 3"
        >
          Stopping location: {{ stoppingString }}
        </v-stepper-step>

        <v-stepper-content step="3">
          <SearchLocation
            :apiKey="apiKey"
            @input="handleLocation($event, -1)"
            @query="stoppingString = $event"
          />
          <v-btn color="primary" @click="stepper += 1"> Continue </v-btn>
          <v-btn
            v-if="stepper > 1"
            text
            @click="stepper = stepper <= 1 ? 1 : stepper - 1"
          >
            Back
          </v-btn>
        </v-stepper-content>

        <v-stepper-step
          :complete="stepper > 4"
          step="4"
          editable
          edit-icon="mdi-check"
          @click="stepper = 4"
        >
          Confirm route!
        </v-stepper-step>

        <v-stepper-content step="4">
          <v-btn
            :disabled="!isValid"
            :color="isValid ? 'success' : 'error'"
            text
            @click="handleStartWalk"
          >
            {{ isValid ? 'Go!' : 'ERROR' }}
          </v-btn>
        </v-stepper-content>
      </v-stepper>
            
      <v-card-text
        class="mx-0 my-0 d-flex justify-center"
        style="width: 100%; height: 100%"
      >
        <div :id="containerID" :style="containerCSS"></div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, createNamespacedHelpers } from 'vuex'
const fb = createNamespacedHelpers('firebase')

import SearchLocation from '@/components/SearchLocation.vue'
import 'mapbox-gl/dist/mapbox-gl.css'
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')

export default {
  components: {
    SearchLocation,
  },
  data: () => ({
    stepper: 1,
    valid: false,
    walkTitle: '',
    walkTitleRules: [
      (v) => !!v || 'Title is required',
      (v) =>
        (typeof v === 'string' && v.length <= 50) ||
        'Title must be less than 50 characters',
    ],
    walkSubtitle: '',
    walkSubtitleRules: [
      (v) =>
        (typeof v === 'string' && v.length <= 50) ||
        'Subtitle must be less than 50 characters',
    ],
    startingString: null,
    stoppingString: null,
    startingLocation: null,
    stoppingLocation: null,

    initialLocation: [-72.928, 41.306],
    mapStyle: 'mapbox://styles/mapbox/streets-v11',
    containerID: 'map-dialog',
    map: null,
    height: '300px',
    width: '500px',
  }),

  watch: {
    stepper: function (newStepper, oldStepper) {
      if (oldStepper === 1 && this.map === null) {
        this.initMap()
      }
    },
  },

  computed: {
    ...mapState(['newWalkDialog']),
    apiKey() {
      return process.env.MAPBOX_KEY
    },
    containerCSS() {
      return {
        width: this.width,
        height: this.height,
      }
    },
    isValid() {
      return (
        this.valid &&
        this.startingLocation !== null &&
        this.stoppingLocation !== null
      )
    },
  },
  methods: {
    ...mapActions(['setNewWalkDialog']),
    ...fb.mapActions(['startWalk', 'setWalk']),
    handleCloseButton() {
      this.setNewWalkDialog(false)
      this.startingString = null
      this.stoppingString = null
      this.startingLocation = null
      this.stoppingLocation = null
      this.walkTitle = ''
      this.walkSubtitle = ''
      this.removeMarkers(1)
      this.removeMarkers(-1)
      this.stepper = 1
    },
    handleStartWalk() {
      this.setWalk({
        title: this.walkTitle,
        subtitle: this.walkSubtitle,
        startLocation: this.startingLocation,
        endLocation: this.stoppingLocation,
      })
      this.startWalk()

      this.handleCloseButton()
    },

    handleLocation(where, which) {
      if (which === 1) {
        this.startingLocation = where
      }
      if (which === -1) {
        this.stoppingLocation = where
      }
      this.removeMarkers(which)
      this.addMapMarker(where, which)
      this.map.flyTo({ center: where, zoom: 10 })
      this.stepper = Number(this.stepper) + 1
    },

    initMap() {
      mapboxgl.accessToken = this.apiKey
      // Create map object
      this.map = new mapboxgl.Map({
        container: this.containerID,
        style: this.mapStyle,
        center: this.initialLocation,
        zoom: 10,
      })
      // Adds basic zoom and rotate control
      this.map.addControl(new mapboxgl.NavigationControl())
      // Add Click Listener

      this.map.on('click', (e) => {
        if (Number(this.stepper) === 2) {
          this.handleLocation([e.lngLat.lng, e.lngLat.lat], 1)
        } else if (Number(this.stepper) === 3) {
          this.handleLocation([e.lngLat.lng, e.lngLat.lat], -1)
        } else {
        }
      })

      this.map.on('load', () => {
        this.map.resize()
      })
    },
    removeMarkers(which) {
      let oldMarker
      if (which === 1) oldMarker = document.querySelector('.start-marker')

      if (which === -1) oldMarker = document.querySelector('.stop-marker')
      console.log(oldMarker)
      if (oldMarker) oldMarker.parentElement.removeChild(oldMarker)
    },
    addMapMarker(lngLat, which) {
      let c = which === 1 ? ' start-marker' : ' stop-marker'
      let marker = new mapboxgl.Marker({ color: this.color })
        .setLngLat(lngLat)
        .addTo(this.map)
      marker._element.className += c
    },
    setLocationCoordinates(lngLat) {
      this.location = [lngLat.lng, lngLat.lat]
    },
    setLocation(lngLat) {
      this.addMapMarker(lngLat)
      this.setLocationCoordinates(lngLat)
      this.$emit('input', this.location)
    },
  },
}
</script>
