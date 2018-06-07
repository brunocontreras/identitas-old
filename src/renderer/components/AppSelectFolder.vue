<template>
  <div>
    <div class="popup">
      <h1>Selecciona una carpeta</h1>
      <button @click="selectDirectory">Seleccionar carpeta</button>
    </div>
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

<style lang="scss" scoped>
.popup {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.15);
  padding: 10px 30px;
  position: fixed;
  width: 400px;
  height: 150px;
  top: 50%;
  left: 50%;
  margin-left: -200px;
  margin-top: -75px;
  text-align: center;
}
</style>
