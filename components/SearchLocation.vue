<template>
  <v-col cols="12" sm="10" md="8" lg="6">
    <v-card flat>
      <v-card
        class="pa-0 ma-0"
        style="margin-bottom: -0px !important; z-index: 10"
      >
        <v-card-text>
          <v-form @submit.prevent="search">
            <v-text-field
              hide-details
              prepend-inner-icon="mdi-magnify"
              single-line
              v-model="query"
              placeholder="Search"
              append-icon="mdi-crosshairs-gps"
              @click:append="requestLocation"
            ></v-text-field>
          </v-form>
        </v-card-text>
      </v-card>
    </v-card>
  </v-col>
</template>

<script>
import 'mapbox-gl/dist/mapbox-gl.css'
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
export default {
  model: {
    prop: 'datetime',
    event: 'input',
  },
  props: {
    height: {
      type: String,
      default: '300px',
    },
    width: {
      type: String,
      default: '500px',
    },
    initialLocation: {
      type: Array,
      default: () => [-0.496934, 51.437032],
    },
    color: {
      type: String,
      default: 'orange',
    },
    apiKey: {
      type: String,
      required: true,
    },
    mapStyle: {
      type: String,
      //   default: "mapbox://styles/mapbox/outdoors-v11",
      default: 'mapbox://styles/mapbox/streets-v11',
    },
    containerID: {
      type: String,
      default: 'map',
    },
  },
  data() {
    return {
      map: null,
      query: '',
      location: [],
    }
  },
  computed: {},
  methods: {
    setLocationCoordinates(lngLat) {
      this.location = [lngLat.lng, lngLat.lat]
    },
    requestLocation() {
      // Request to get the user's current location
      window.navigator.geolocation.getCurrentPosition((position) => {
        // get the latitude and longitude returned
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        // set location data
        this.setLocation({ lng, lat })
      })
    },
    setLocation(lngLat) {
      this.setLocationCoordinates(lngLat)
      this.$emit('input', this.location)
    },

    async search() {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.query}.json?access_token=${process.env.MAPBOX_KEY}`
      )
      //   this.query = "";
      const responseBody = await response.json()
      // Check we have at least 1 result
      if (responseBody.features.length == 0) {
        alert('no results found')
        return null
      }
      const [lng, lat] = responseBody.features[0].center
      this.setLocation({ lng, lat })
      this.$emit('query', this.query)
    },
  },
  mounted() {},
}
</script>

<style>
.map-toolbar {
  z-index: 10;
}
</style>
