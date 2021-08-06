<template>
  <h1>Picker 示例</h1>
  <Picker />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Picker from "./components/3d-picker/Picker";

export default defineComponent({
  name: "App",
  components: {
    Picker,
  },
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: #e0e0e0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
