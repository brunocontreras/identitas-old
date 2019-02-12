<template>
  <div class="presentation">
    <vue-displacement-slideshow
      :images="images"
      displacement="../static/displacement.png"
      :intensity="0.5"
      :speedIn="0.75"
      :speedOut="0.75"
      ease="Expo.easeInOut"
      ref="slideshow">
    </vue-displacement-slideshow>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VueDisplacementSlideshow from 'vue-displacement-slideshow'
export default {
  components: {
    VueDisplacementSlideshow
  },
  props: {
    id: {
      type: [String, Number]
    }
  },
  computed: {
    ...mapState(['data']),
    images () {
      return this.data.presentations[this.id].slides
    }
  },
  mounted () {
    setInterval(() => {
      this.$refs.slideshow.next()
      console.log('next')
    }, 2500)
  }
}
</script>

<style>
.presentation {
  height: 100vh;
}
</style>
