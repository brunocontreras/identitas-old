<template>
  <div class="section">
    <md-button class="md-icon-button md-raised" @click="$router.go(-1)">
      <md-icon>arrow_back</md-icon>
    </md-button>
    <span class="md-display-3">{{ section.name }}</span>
    <div v-if="section.courses">
      <div class="grid">
        <md-card md-with-hover v-for="(course, i) in section.courses" :key="i" @click.native="goToCourse(course)">
          <md-ripple>
            <md-card-header>
              <div class="md-title">{{ course.name }}</div>
              <div class="md-subhead">{{ course.presentations.length }} presentaciones</div>
            </md-card-header>
            <md-card-content>
              <md-avatar v-for="presentation in course.presentations" :key="presentation">
                <img class="image" :src="data.presentations[presentation].slides[0]" @load="onImageLoaded">
              </md-avatar>
            </md-card-content>
          </md-ripple>
        </md-card>
      </div>
    </div>
    <div v-else-if="section.presentations">
      <div class="grid">
        <md-card md-with-hover v-for="presentation in section.presentations" :key="presentation">
          <md-ripple>
            <md-card-media>
              <img class="image" :src="data.presentations[presentation].slides[0]" @load="onImageLoaded">
            </md-card-media>
            <md-card-header>
              <div class="md-title">{{ data.presentations[presentation].name }}</div>
              <div class="md-subhead">{{ data.presentations[presentation].slides.length }} diapositivas</div>
            </md-card-header>
          </md-ripple>
        </md-card>
      </div>
    </div>
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
        section = section.courses.find(x => x.name === this.level2)
      }
      return section
    }
  },
  methods: {
    goToCourse (course) {
      this.$router.push(`/section/${this.level1}/${course.name}`)
    },
    onImageLoaded (event) {
      event.target.classList.add('image--show')
    }
  }
}
</script>

<style lang="scss" scoped>
.section {
  padding: 2rem;
}
.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: stretch;
  overflow-y: auto;
}
.md-card {
  flex-basis: 20%;
  min-width: 320px;
  margin: 2.5%;
  margin-left: 0;
  overflow: hidden;
}
.md-subhead {
  margin-top: 1rem;
}
.md-avatar {
  margin: 2px;
}
.image {
  opacity: 0;
  transition: opacity .25s;
}
.image--show {
  opacity: 1;
}
</style>
