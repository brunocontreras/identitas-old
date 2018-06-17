<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'identitas'
}
</script>

<style>
*,
:after,
:before {
  box-sizing: border-box;
}
html {
  font-size: 62.5%;
}
body {
  margin: 0;
  height: 100%;
  width: 100%;
  /* overflow: hidden; */
  font-size: 1.4rem;
}
@font-face {
  font-family: "Roboto";
  src: url("~@/assets/fonts/Roboto-Regular.ttf");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: "Roboto";
  src: url("~@/assets/fonts/Roboto-Italic.ttf");
  font-weight: 400;
  font-style: italic;
}
@font-face {
  font-family: "Roboto";
  src: url("~@/assets/fonts/Roboto-Medium.ttf");
  font-weight: 500;
  font-style: normal;
}
@font-face {
  font-family: "Roboto";
  src: url("~@/assets/fonts/Roboto-Bold.ttf");
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: 'Material Icons';
  src: url("~@/assets/fonts/Material-Icons.woff2");
  font-style: normal;
  font-weight: 400;
}
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
</style>
