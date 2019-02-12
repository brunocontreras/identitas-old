<template>
  <div class="presentation">
    <vue-displacement-slideshow
      v-if="false"
      :images="images"
      displacement="../static/displacement.png"
      :intensity="0.5"
      :speedIn="0.75"
      :speedOut="0.75"
      ease="Expo.easeInOut"
      ref="slideshow">
    </vue-displacement-slideshow>
    <vue-plyr>
      <video :src="video"></video>
    </vue-plyr>
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
    },
    video () {
      return this.data.videos[this.data.presentations[this.id].videos[0]].path
    }
  },
  mounted () {
    // setInterval(() => {
    //   this.$refs.slideshow.next()
    //   console.log('next')
    // }, 2500)
  }
}
</script>

<style>
.presentation {
  height: 100vh;
}
</style>
