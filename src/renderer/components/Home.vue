<template>
  <div>
    <div>Selecciona una carpeta</div>
    <button @click="selectDirectory">Seleccionar carpeta</button>
  </div>
</template>

<script>
import readRootDirectory from '@/logic'
export default {
  name: 'Home',
  methods: {
    selectedDirectory (paths) {
      if (paths === undefined) {
        console.warn('No se escogió ninguna carpeta')
      } else {
        const dir = paths[0]
        readRootDirectory(dir)
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
