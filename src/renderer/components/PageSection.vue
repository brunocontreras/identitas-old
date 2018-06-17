<template>
  <div>
    <div v-if="section.courses">
      <ul>
        <li v-for="(course, i) in section.courses" :key="i">
          {{ course.name }} - {{ course.presentations.length }}
        </li>
      </ul>
    </div>
    <div v-else-if="section.presentations">Presentations</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'PageSection',
  props: {
    level1: {
      type: String,
      required: true
    },
    level2: String
  },
  computed: {
    ...mapState(['data']),
    section () {
      let section = this.data[this.level1]
      if (this.level2) {
        section = section[this.level2]
      }
      return section
    }
  }
}
</script>

<style>

</style>
