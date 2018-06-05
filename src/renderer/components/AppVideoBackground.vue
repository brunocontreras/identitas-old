<template>
  <div>
    <video ref="video" :src="source" autoplay class="video" loop @canplay="$emit('canPlay')"></video>
    <div class="video-mask"></div>
  </div>
</template>

<script>
export default {
  name: 'AppVideoBackground',
  data: () => ({
    source: '/static/bg_video.mp4'
  })
}
</script>

<style lang="scss" scoped>
.video {
  height: 100vh;
  position: fixed;
  z-index: -1;
}
.video-mask {
  background-image: radial-gradient(rgba(0,0,0,.25), rgba(0,0,0,1));
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: -1;
}
</style>
