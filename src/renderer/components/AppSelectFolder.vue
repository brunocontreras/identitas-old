<template>
  <md-dialog
    :md-active="isActive"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-backdrop="false">
    <md-empty-state
      md-icon="create_new_folder"
      md-label="Contenido"
      md-description="Para poder mostrar las presentaciones debes seleccionar la carpeta con el contenido.">
      <md-button class="md-raised md-primary" @click="selectDirectory">Seleccionar carpeta</md-button>
    </md-empty-state>
  </md-dialog>
</template>

<script>
import readRootDirectory from '@/logic'
import { mapMutations } from 'vuex'
export default {
  name: 'AppSelectFolder',
  props: {
    isActive: Boolean
  },
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
