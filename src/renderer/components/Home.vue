<template>
  <div>
    <app-video-background />
    <app-select-folder v-if="!data" />
    <template v-else>
      <app-card imageUrl="/static/conferences.jpg" section="Expertos"></app-card>
      <app-card imageUrl="/static/conferences.jpg" section="Familia"></app-card>
      <!-- <h1 v-if="data.experts">Expertos</h1> -->
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
      </ul>
    </template>
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
  computed: {
    ...mapState(['data'])
  }
}
</script>

<style>
</style>
