<template>
  <div>
    <div>Selecciona una carpeta</div>
    <button @click="selectDirectory">Seleccionar carpeta</button>
  </div>
</template>

<script>
import readRootDirectory from '@/logic'
import { mapMutations } from 'vuex'
export default {
  name: 'AppSelectFolder',
  methods: {
    ...mapMutations([
      'SET_DATA',
      'SET_LOG'
    ]),
    selectedDirectory (paths) {
      if (paths === undefined) {
        console.warn('No se escogió ninguna carpeta')
      } else {
        const dir = paths[0]
        const { data, log } = readRootDirectory(dir)
        this.SET_DATA(data)
        this.SET_LOG(log)
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
