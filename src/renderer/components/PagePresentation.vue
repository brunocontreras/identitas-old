<template>
  <div class="presentation" @keyup.right="next" @keyup.left="prev">
    <vue-displacement-slideshow
      :images="images"
      displacement="../static/displacement.png"
      :intensity="0.5"
      :speedIn="0.75"
      :speedOut="0.75"
      ease="Expo.easeInOut"
      ref="slideshow">
    </vue-displacement-slideshow>
    <md-button class="button md-raised md-primary" @click="playVideo">Show video</md-button>
    <vue-plyr v-if="showVideo" class="video">
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
  data: () => ({
    showVideo: false
  }),
  computed: {
    ...mapState(['data']),
    images () {
      return this.data.presentations[this.id].slides
    },
    video () {
      return this.data.videos[this.data.presentations[this.id].videos[0]].path
    },
    next () {
      this.$refs.slideshow.next()
    },
    prev () {
      this.$refs.slideshow.previous()
    }
  },
  mounted () {
    this.keyupHandler = this.keyup.bind(this)
    document.addEventListener('keyup', this.keyupHandler)
    // setInterval(() => {
    //   this.$refs.slideshow.next()
    //   console.log('next')
    // }, 2500)
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.keyupHandler)
  },
  methods: {
    keyup (e) {
      if (e.keyCode === 37) this.prev()
      if (e.keyCode === 39) this.next()
    },
    playVideo () {
      this.showVideo = true
    }
  }
}
</script>

<style>
.presentation {
  height: 100vh;
}
.button {
  position: absolute;
  top: 50px;
  left: 50px;
}
.video {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
