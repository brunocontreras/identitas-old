<template>
  <div>
    <div v-if="section.courses">
      <ul>
        <li v-for="course in section.courses">
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
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(['data']),
    section () {
      return this.data[this.name]
    }
  }
}
</script>

<style>

</style>
