<template>
  <div class="card">
    <div :style="{ backgroundImage: `url(${imageUrl})` }" class="image"></div>
    <h1 class="label">{{ section }}</h1>
  </div>
</template>

<script>
export default {
  name: 'AppCard',
  props: {
    imageUrl: {
      type: String,
      required: true
    },
    section: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
.card {
  width: 20vw;
  height: 20vw;
  margin: 2.5vw;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.image {
  background-size: cover;
  background-position: 50%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
}
.label {
  font-size: 50px;
  color: #fff;
  margin-right: -5vw;
}
</style>
