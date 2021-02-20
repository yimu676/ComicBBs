<template>
  <van-tabbar v-model="active">
    <van-tabbar-item icon="home-o"
                     @click="$router.push('/home')">首页</van-tabbar-item>
    <van-tabbar-item icon="edit"
                     @click="$router.push('/post')">发表</van-tabbar-item>
    <van-tabbar-item icon="user-o"
                     @click="$router.push('/my')">我的</van-tabbar-item>

  </van-tabbar>
</template>

<script>
export default {
  name: "Botton",
  data () {
    return {
      active: 0,
    };
  },
   created () {
  /* 判断当前页面是哪个页面,解决刷新时,tab默认为 1 的bug */
    const CURRENTHREF = window.location.href;
    if (CURRENTHREF.includes('/home')) {
      this.active = 0
    } else if (CURRENTHREF.includes('/post')) {
      this.active = 1
    } else if (CURRENTHREF.includes('/my')) {
      this.active = 2
  }
  }
};

</script>

<style>
</style>