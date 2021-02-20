<template>
  <div class="userinfo">
    <tab-bar></tab-bar>
    <img v-if="this.model" :src="this.model.avatar" alt="" class="backImg" />
    <img v-else src="../assets/img/avatar-default.png" alt="" class="backImg" />
    <user-detail :userInfo="this.model"></user-detail>
    <user-article></user-article>
    <botton />
  </div>
</template>

<script>
import TabBar from "../components/common/TabBar";

import userDetail from "../components/userComponent/userDetail";
import userArticle from "../components/userComponent/userArticle";
import Botton from "../components/common/Botton.vue";
export default {
  data() {
    return {
      model: {},
    };
  },
  components: {
    TabBar,
    userDetail,
    userArticle,
    Botton,
  },
  methods: {
    async UserinfoData() {
      if (!sessionStorage.getItem("id")) {
         this.$msg.fail("请先登录")
         return;
      }else{
        const id = sessionStorage.getItem("id");
        const res = await this.$http("post", "/api/userinfo/?id=" + id);
        this.model = res.data.user[0];
      }
     
    },
  },
  created() {
    this.UserinfoData();
  },
};
</script>

<style lang="less">
.userinfo {
  .backImg {
    height: 100px;
    width: 100%;
  }
}
</style>
