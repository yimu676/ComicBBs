<template>
  <div>
    <div class="container">
      <div>
        <div class="nav" @click="$router.push('/my')">
          <img :src="article.icon" alt="" />
        </div>

        <div class="name">
          <span>{{ article.username }}</span>
          <span
            >{{ article.created_time.split("T")[0] }}&nbsp;&nbsp;{{
              article.created_time.split("T")[1].split(".")[0]
            }}</span
          >
        </div>
        <img
          v-if="isShow"
          @click="addcollection"
          class="img"
          :class="{ active: colorShow }"
          src="../../assets/icon/收藏.png"
          alt=""
        />
        <img
          v-else
          class="img"
          @click="updateArticle"
          src="../../assets/icon/编辑.png"
          alt=""
        />
      </div>
      <div
        class="desc"
        @click="
          $router.push({ path: '/detail', query: { articleId: article._id } })
        "
      >
        <span>
          {{ article.title }}
        </span>
      </div>
      <div class="pic">
        <img :src="article.img_src[0]" alt="" />
      </div>
      <div class="bar">
        <span>评论 {{ article.commentNum }}</span>
        <span>收藏 {{ article.likeNum }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["article"],
  data() {
    return {
      isShow: true,
      user: {},
      colorShow: false,
      commentNum:0,
    };
  },
  created() {
    this.init();
    this.collectionInit()
    this.commentInit();
  },
  methods: {
    init() {
      const userId = sessionStorage.getItem("id");
      if (userId == this.article.user_id) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    async commentInit(){
       var obj2 = {
            _id:  this.article._id
          };
          let result2 = await this.$http("post", '/api/getComment', obj2);
          if (result2.data.code == 101) {
            this.commentNum = result2.data.comments.length;
          } else {
            this.$msg.fail("请求出错请重试！");
          }
    },
    async collectionInit() {
      const userId = sessionStorage.getItem("id");
      var obj = {
        userID: userId,
      };
      let result2 = await this.$http("post", "/api/getCollection", obj);
      if (result2.data.code == 101) {
        this.collection = result2.data.collection;
        for (let i = 0; i < this.collection.length; i++) {
          if (this.article._id==this.collection[i].topic_id) {
            this.colorShow = true;
          }
          
        }
        
      } else {
        this.$router.push("/my");
      }
    },
    updateArticle() {
      this.$EventBus.$emit("updateArticle", this.article);
      setTimeout(() => {
        this.$router.push("/post");
      }, 500);
    },
    async addcollection() {
      let res = await this.$http("get", "/api/getsession");

      if (res.data.user) {
        this.user = res.data.user;
        var obj = {
          topic_id: this.article._id,
          collector_id: this.user._id,
          collector_avatar: this.user.avatar,
          collector_username: this.user.username,
          poster_username: this.article.username,
          topic_title: this.article.title,
          topic_content: this.article.content,
          poster_avatar: this.article.icon,
          topic_createdTime: this.article.created_time,
        };
        let result2 = await this.$http("post", "/api/addCollection", obj);
        if (result2.data.code == 101) {
           this.colorShow = true;
           this.article.likeNum +=1
          this.$msg.fail(result2.data.message);
        } else if (result2.data.code == 100) {
          const userId = sessionStorage.getItem("id");
          const articleId =this.article._id
          var obj ={
            userID:userId,
            articleID:articleId,
          }
          let res2 = await this.$http("post", "/api/deleteCollection", obj)
          this.colorShow = false;
          this.article.likeNum -=1
          this.$msg.fail(res2.data.message);
        }
      } else {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style lang="less">
.container {
  width: 96%;
  position: relative;
  margin-top: 2.133vw;
  margin-left: 2.133vw;
  margin-right: 2.133vw;
  border-radius: 2.133vw;
  background-color: #fff;
  div {
    display: flex;
    .nav img {
      margin-left: 2.667vw;
      margin-top: 2.667vw;
      width: 8vw;
      height: 8vw;
      border-radius: 50%;
    }
    .active {
      border-right: 0px solid transparent; /*必不可少*/
      -webkit-filter: drop-shadow(0 0 0 #fb7299);
      filter: drop-shadow(0 0 0 #fb7299);
    }
    .img {
      margin-top: 2.133vw;
      margin-left: 42vw;
    }
    .name {
      margin-top: 2.133vw;
      margin-left: 2.667vw;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      span:nth-child(1) {
        font-weight: bold;
      }
      span:nth-child(2) {
        font-size: 3.2vw;
        opacity: 0.5;
      }
    }
  }
  .desc {
    margin-left: 2.133vw;
    margin-top: 4vw;
    font-weight: bold;
  }
  .pic {
    margin: 2.667vw;
    display: flex;
    flex-wrap: wrap;
    img {
      flex: 1;
      display: block;
      object-fit: cover;
      margin-left: 2.133vw;
      width: 30%;
      margin-top: 0.8vw;
    }
  }
  .bar {
    display: flex;
    justify-content: space-around;

    span {
      opacity: 0.5;
      font-size: 3.733vw;
      margin-bottom: 1.333vw;
    }
  }
}
</style>