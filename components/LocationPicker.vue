<template>
  <div>
    <v-toolbar dense floating class="map-toolbar" v-if="searchForm || geo">
      <v-form @submit.prevent="search" v-if="searchForm">
        <v-text-field
          hide-details
          prepend-icon="mdi-magnify"
          single-line
          v-model="query"
          placeholder="Search"
        ></v-text-field>
      </v-form>

      <v-btn icon v-if="geo" @click="requestLocation">
        <v-icon>mdi-crosshairs-gps</v-icon>
      </v-btn>
    </v-toolbar>
    <div :id="containerID" :style="containerCSS"></div>
  </div>
</template>

<script>
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')
export default {
  model: {
    prop: 'datetime',
    event: 'input',
  },
  props: {
    value: {
      type: Object,
    },
    geo: {
      type: Boolean,
      default: true,
    },
    searchForm: {
      type: Boolean,
      default: true,
    },
    height: {
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
      default: 'mapbox://styles/mapbox/outdoors-v11',
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
  computed: {
    containerCSS() {
      return {
        width: '100%',
        height: this.height,
      }
    },
  },
  methods: {
    initMap() {
      mapboxgl.accessToken = this.apiKey
      // Create map object
      this.map = new mapboxgl.Map({
        container: this.containerID,
        style: this.mapStyle,
        center: this.initialLocation,
        zoom: 5,
      })
      // Adds basic zoom and rotate control
      this.map.addControl(new mapboxgl.NavigationControl())
      // Add Click Listener
      this.map.on('click', (e) => {
        this.setLocation(e.lngLat)
      })
    },
    removeMapMarkers() {
      const oldMarker = document.querySelector('.mapboxgl-marker')
      if (oldMarker) {
        oldMarker.parentElement.removeChild(oldMarker)
      }
    },
    addMapMarker(lngLat) {
      new mapboxgl.Marker({ color: this.color })
        .setLngLat(lngLat)
        .addTo(this.map)
    },
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
        this.map.flyTo({ center: [lng, lat], zoom: 15 })
      })
    },
    setLocation(lngLat) {
      this.removeMapMarkers()
      this.addMapMarker(lngLat)
      this.setLocationCoordinates(lngLat)
      this.$emit('input', this.location)
    },
    async search() {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.query}.json?access_token=${process.env.MAPBOX_KEY}`
      )
      this.query = ''
      const responseBody = await response.json()
      // Check we have at least 1 result
      if (responseBody.features.length == 0) {
        alert('no results found')
        return null
      }
      const [lng, lat] = responseBody.features[0].center
      this.setLocation({ lng, lat })
      this.map.flyTo({ center: [lng, lat], zoom: 15 })
    },
  },
  mounted() {
    this.initMap()
  },
}
</script>

<style>
.map-toolbar {
  margin-bottom: -60px;
  margin-left: 8px;
  z-index: 10;
}
</style>
