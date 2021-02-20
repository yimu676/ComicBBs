<template>
  <div id="app">
    <keep-alive>
        <router-view v-if="$route.meta.keepalive" />
    </keep-alive>
         <router-view v-if="!$route.meta.keepalive" />
    <div style="height: 5rem;"></div>
    <botton v-if="tabType" />
  </div>
</template>
<script>

import Botton from './components/common/Botton.vue'
export default {
  data () {
    return{
      tabType:true
    } 
  },
  components: { Botton },
  watch: {
    $route (e) {
      if (e.name == 'Home' || e.name == 'My' || e.name == 'Post') {
        this.tabType = true
      } else {
        this.tabType = false
      }
    }
  }

}
</script>
<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f4f4f4;
}
p {
  margin: 0;
  padding: 0;
}
</style>
