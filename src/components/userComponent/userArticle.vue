<template>
 <div class="test">
      <div class="user-article">
      <van-tabs v-model="active" swipeable sticky duration=0.5>
        <van-tab title="动态">
          <article-list
            :article="itemList"
            v-for="itemList in this.articleList"
            :key="itemList._id"
          />
        </van-tab>
        <van-tab  title="收藏">
          <article-list 
            :article="itemList"
            v-for="itemList in this.articleList"
            :key="itemList._id"
          />
        </van-tab>
      </van-tabs>
      <!-- <span>动态</span>
        <article-list  :article="itemList" v-for="itemList in this.articleList" :key="itemList._id" /> -->
  </div>
 </div>
</template>

<script>
import ArticleList from "../article/ArticleList";
export default {
  components: { ArticleList },
  data() {
    return {
      active: "",
      articleList: [],
    };
  },
  methods: {
    async UserinfoData() {
      if (!sessionStorage.getItem("id")) {
        this.$msg.fail("请先登录");
        return;
      } else {
        const id = sessionStorage.getItem("id");
        const res2 = await this.$http("post", "/api/arctcleid?id=" + id);
        this.articleList = res2.data.topics;
      }
    },
    async collectionList() {
      if (!sessionStorage.getItem("id")) {
        this.$msg.fail("请先登录");
        return;
      } else {
        const userId = sessionStorage.getItem("id");
        var obj = {
          userID: userId,
        };
        let res2 = await this.$http("post", "/api/getCollection", obj);
        let res3 = []
       for (let i = 0; i < res2.data.collection.length; i++) {
          const id =res2.data.collection[i].topic_id
          let res4 = await this.$http("post", "/api/detail?id=" + id)
           res3.push(res4.data.topic) 
       }
       this.articleList = res3;
        
      }
    },
  },
  watch: {
    active: function () {
      if (this.active == 0) {
        this.UserinfoData();
      } else if (this.active == 1) {
        this.collectionList();
      }
    },
    immediate: true,
  },
};
</script>

<style lang="less">
.test {
  position: relative;
}
.user-article {
  display: flex;
  position: absolute;
  align-items: center;
  background-color: white;
  padding: 0 2.778vw;
  border-top: 0.278vw solid #ddd;
  van-tab {
    margin: 0 1.944vw;
    text-align: center;
    color: #777;
  }
}
</style>
