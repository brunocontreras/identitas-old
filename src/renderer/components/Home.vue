<template>
  <div>
    <app-video-background @loaded="onVideoLoaded" />
    <app-select-folder :isActive="showFolderSelecter" />
    <div class="data-container" v-if="data">
      <app-card
        imageUrl="static/experts.jpg"
        :disabled="data.experts.disabled"
        :section="data.experts.name"
        @click="goTo('/section/experts', data.experts.disabled)"
      ></app-card>
      <app-card
        imageUrl="static/family.jpg"
        :disabled="data.family.disabled"
        :section="data.family.name"
        @click="goTo('/section/family', data.family.disabled)"
      ></app-card>
      <app-card
        imageUrl="static/training.jpg"
        :disabled="data.training.disabled"
        :section="data.training.name"
        @click="goTo('/section/training', data.training.disabled)"
      ></app-card>
      <app-card
        imageUrl="static/conferences.jpg"
        :disabled="data.conferences.disabled"
        :section="data.conferences.name"
        @click="goTo('/section/conferences', data.conferences.disabled)"
      ></app-card>
      <!--
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
    <div class="loading" :class="{ hide: videoLoaded }" @transitionend="onLoadingFinished"></div>
  </div>
</template>

<script>
/* Logic */
import { mapState, mapActions } from 'vuex'
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
    videoLoaded: false,
    isLoading: true
  }),
  computed: {
    ...mapState(['data']),
    showFolderSelecter () {
      return !this.data && this.videoLoaded && !this.isLoading
    }
  },
  methods: {
    ...mapActions(['READ_ROOT_DIRECTORY']),
    onVideoLoaded () {
      this.videoLoaded = true
    },
    onLoadingFinished () {
      this.isLoading = false
    },
    goTo (path, isDisabled) {
      if (!isDisabled) {
        this.$router.push(path)
      }
    }
  },
  created () {
    const root = localStorage.getItem('root')
    if (root) this.READ_ROOT_DIRECTORY(root)
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
