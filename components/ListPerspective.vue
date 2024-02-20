<template>
    <div>
      <ul class="mx-auto" :style="style">
        <ListPerspectiveItem
          v-for="(alert, index) in alerts"
          :key="alert.id"
          :index="index"
          :alert="alert"
          :totalElements="alerts.length"
          :verticalShift="shift"
          :hoverShift="15"
          @close="remove(index)"
        />
      </ul>
      <v-btn text block @click="shift = (shift === verticalShift) ? 0 : verticalShift">
        click to collapse / expand
      </v-btn>
    </div>
  
  </template>
  
  <script>
  import ListPerspectiveItem from '@/components/ListPerspectiveItem.vue';
  
  export default {
    components: {ListPerspectiveItem},
    props: {
      alerts: {
        type: Array,
        default: () => [
          {title: 'title', message: 'message 1', type: 'info'},
          {title: 'title', message: 'message 2', type: 'info'},
          {title: 'title', message: 'message 3', type: 'info'},
          {title: 'title', message: 'message 4', type: 'info'},
          {title: 'title', message: 'message 5', type: 'info'},
          {title: 'title', message: 'message 6', type: 'info'},
        ]
      },
      verticalShift: {
        type: Number,
        default: 55
      }
    },
    data() {
      return {
        shift: this.verticalShift
      }
    },
    methods: {
      remove(index) {
        this.alerts.splice(index, 1)
      }
    },
    computed: {
      style() {
        return {
          paddingTop: `${this.verticalShift}px`,
          position: 'relative'
        }
      }
    }
  }
  </script>
  
  <style>
  ul {
    width: 80%;
    margin: 0px;
    padding: 0px;
  }
  </style>
  