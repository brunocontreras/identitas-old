<template>
  <div>
    <app-video-background @canPlay="handleCanPlay" />
    <app-select-folder v-if="!data" />
    <div class="data-container" v-else>
      <app-card imageUrl="/static/experts.jpg" section="Expertos"></app-card>
      <app-card imageUrl="/static/family.jpg" section="Familia"></app-card>
      <app-card imageUrl="/static/training.jpg" section="Formación"></app-card>
      <app-card imageUrl="/static/conferences.jpg" section="Conferencias"></app-card>
      <!--
      <h1 v-if="data.experts">Expertos</h1>
      <h1 v-if="data.family">Familia</h1>
      <h1 v-if="data.training">Formación</h1>
      <h1 v-if="data.conferences">Conferencias</h1>
      <ul>
        <li v-for="(video, index) in data.videos" :key="video.id">
          <strong>{{ index }}. {{ video.name }}</strong>
          <div style="color: #666">({{ video.path }})</div>
          <video :src="video.path" controls width="300" preload="none">
            Tu navegador no admite el elemento <code>video</code>.
          </video>
        </li>
      </ul> -->
    </div>
    <div class="loading" :class="{ hide: videoLoaded }"></div>
  </div>
</template>

<script>
/* Logic */
import { mapState } from 'vuex'
/* Components */
import AppVideoBackground from '@/components/AppVideoBackground'
import AppSelectFolder from '@/components/AppSelectFolder'
import AppCard from '@/components/AppCard'

export default {
  name: 'Home',
  components: {
    AppVideoBackground,
    AppSelectFolder,
    AppCard
  },
  data: () => ({
    videoLoaded: false
  }),
  computed: {
    ...mapState(['data'])
  },
  methods: {
    handleCanPlay () {
      this.videoLoaded = true
    }
  }
}
</script>

<style>
.data-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 100vh;
  padding-bottom: 15vh;
}
.loading {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  transition: opacity 1.5s;
  pointer-events: none;
}
.hide {
  opacity: 0;
}
</style>
