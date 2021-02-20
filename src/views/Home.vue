<template>

  <div class="home">
    <tab-bar />
    <van-tabs v-model="active" swipeable sticky duration=0.5>
      <van-tab title="国漫">
        <article-list  :article="itemList" v-for="itemList in this.article" :key="itemList._id" />
      </van-tab>
      <van-tab title="日漫">
        <article-list  :article="itemList" v-for="itemList in this.article" :key="itemList._id" />
      </van-tab>
      <van-tab title="美漫">
        <article-list  :article="itemList" v-for="itemList in this.article" :key="itemList._id" />
      </van-tab>
    </van-tabs>

    <botton />

  </div>
</template>

<script>

import TabBar from "../components/common/TabBar"
import Botton from "../components/common/Botton"
import ArticleList from "../components/article/ArticleList"

export default {
  data () {
    return {
      active: 0,
      article:[]
    };
  },
  components: { TabBar, Botton, ArticleList },
  created() {
     this.getArticleList()
  },
  methods:{
   async getArticleList() {
       let plate = this.active
       let res = await this.$http('post','/api/article/?plate='+plate)
       this.article = res.data.topics
    }
  },
  watch:{
    active: function(){
      this.getArticleList()
    },
    immediate: true
  }
  
}
</script>
