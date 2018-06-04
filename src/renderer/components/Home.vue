<template>
  <div>
    <app-video-background />
    <div>Selecciona una carpeta</div>
    <button @click="selectDirectory">Seleccionar carpeta</button>
    <template v-if="data">
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
      </ul>
    </template>
  </div>
</template>

<script>
/* Logic */
import readRootDirectory from '@/logic'
/* Components */
import AppVideoBackground from '@/components/AppVideoBackground'

export default {
  name: 'Home',
  components: {
    AppVideoBackground
  },
  data: () => ({
    data: null,
    log: null
  }),
  methods: {
    selectedDirectory (paths) {
      if (paths === undefined) {
        console.warn('No se escogió ninguna carpeta')
      } else {
        const dir = paths[0]
        const { data, log } = readRootDirectory(dir)
        this.data = data
        this.log = log
      }
    },
    selectDirectory () {
      const options = {
        title: 'Selecciona una carpeta',
        properties: ['openDirectory']
      }
      this.$electron.remote.dialog.showOpenDialog(options, this.selectedDirectory)
    }
  }
}
</script>

<style>
</style>
