<template>
    <v-alert
      class="list-perspective-item"
      :style='style'
      :type='alert.type'
      :value="true"
      
      dismissible
      @mouseover.native="hoveredQ=true"
      @mouseleave.native="hoveredQ=false"
      @click.capture.once.self.stop="clicked"
    >
    <!-- :prominent="alert.type === 'warning'" -->
    <span><strong>{{alert.title}}</strong> {{alert.message}}</span>
    </v-alert>   
</template>

<script>

export default {
  name: 'ListPerspectiveItem',
  components: {},
  props: {
    alert: {
      type: Object,
      default: () => {return {title: '', message: ''}}
    },
    index: {
      type: Number,
      default: 0
    },
    verticalShift: {
      type: Number, default: 15
    },
    hoverShift: {
      type: Number, default: 15
    },
    hoverOpacityScale: {
      type:Number, default: 1
    },
    totalElements: {
      type:Number, default: 1
    }
  },
  data() {
    return {
      hoveredQ: false
    }
  },
  computed: {
    top() {
      var hoverShift = (this.hoveredQ ? this.hoverShift: 0)
      return this.index * this.verticalShift - hoverShift
    },
    marginTop() {
      return -this.verticalShift
    },
    opacity() {
      var perc = (this.index + 1) / this.totalElements
      return 1 - (1 - perc) * this.hoverOpacityScale
    },
    boxShadow() {
      return `0px ${this.top / 5}px 15px 0px`
    },
    style() {
      var sty = {
        marginTop: `${this.marginTop}px`,
        // top: `${this.top}px`,
        opacity: `${this.opacity} !important`,
        // boxShadow: this.boxShadow
      };
      if (this.hoveredQ) {
        sty.transform = `translateY(-${this.hoverShift}px)`;
      }
      return sty
    }
  },
  methods: {
    clicked(event) {
      event.preventDefault()
      this.$emit('close', this.index)
      console.log('hi')
    }
  }

}
</script>

<style scoped>
.list-perspective-item {
  transition: all 0.5s ease;
  /* position: absolute; */
  width: 100%;
  text-align: left;
}

</style>
