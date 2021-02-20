<template>
  <div>
    <div class="d-nav">
      <div class="d-option" @click="$router.back(-1)">返回</div>
      <div class="d-name">{{ article.username }}</div>
      <div v-if="isShow" class="btn" @click="followWithInsert">
        {{ follow }}
      </div>
      <div v-else class="btn" @click="deleteArticle">删除</div>
    </div>
    <div class="swiper">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item
          v-for="(item, index) in this.article.img_src"
          :key="index"
          ><img :src="item" alt=""
        /></van-swipe-item>
      </van-swipe>
    </div>
    <div class="title">
      <span>{{ this.article.title }}</span>
    </div>
    <div class="desc">
      <span>{{ this.article.content }}</span>
    </div>
    <div class="entry">
      <p>
        免责声明：本文章来自客户端自媒体，不代表本平台的观点和立场！2020-11-29
      </p>
    </div>
    <div @click="deleteFollow" class="botton">
      <i></i>
    </div>
    <div class="comment">
      <div class="comment_head">评论：{{ comments.length }}</div>
      <div class="comment_text">
        <input
          ref="textarea"
          placeholder="请输入你要评论的内容"
          maxlength="120"
        />
        <button class="comment_btn" @click="commitComment">发表评论</button>
      </div>
      <div
        class="comment_content"
        v-for="(comment, index) in comments"
        :key="comment._id"
      >
        <div class="comment_content_head">
          <div class="commenter_avatar">
            <img :src="comment.conmmenter_avatar" alt />
          </div>
          <div class="commenter_username">{{ comment.comment_username }}</div>
          <div class="commenter_delete" @click="deleteComment(comment._id,comment.commenter_id)">
            <img src="../assets/icon/删 除.png" />
          </div>
          <div class="commenter_floor">{{ index + 1 }}楼</div>
        </div>
        <div class="commenter_content">
          <div class="content">{{ comment.comment_content }}</div>
        </div>
        <div class="comment_footer">
          <div class="comment_createdtime">
            {{ comment.created_time.split("T")[0] }}&nbsp;&nbsp;{{
              comment.created_time.split("T")[1].split(".")[0]
            }}
          </div>
        </div>
      </div>
    </div>
    <div>
      <botton />
    </div>
  </div>
</template>

<script>
import Botton from "../components/common/Botton";
export default {
  data() {
    return {
      article: {},
      isShow: true,
      id: "",
      follow: "关注",
      comments: "",
      dShow: false,
    };
  },
  components: { Botton },
  created() {
    const id = this.$route.query.articleId;
    this.getArticle(id);
    this.id = id;
    this.followInit();
    this.commentInit();
  },
  methods: {
    async commentInit() {
      var obj2 = {
        _id: this.$route.query.articleId,
      };
      let result2 = await this.$http("post", "/api/getComment", obj2);
      if (result2.data.code == 101) {
        this.comments = result2.data.comments;
        var id = sessionStorage.getItem("id");
        for (let i = 0; i < this.comments.length; i++) {
          if (id === this.comments[i].commenter_id) {
            this.dShow = true;
          } else {
            this.dShow = false;
          }
        }
      } else {
        this.$msg.fail("请求出错请重试！");
      }
    },
    async commitComment() {
      var comment_content = this.$refs.textarea.value;
      var topic_id = this.$route.query.articleId;
      let obj = {
        comment_content: comment_content,
        topic_id: topic_id,
      };
      if (comment_content) {
        let result = await this.$http("post", "/api/commitComment", obj);
        if (result.data.code == 102) {
          this.$router.push("/login");
          this.$msg.fail(result.data.message);
        } else if (result.data.code == 101) {
          this.$msg.fail(result.data.message);
          this.$refs.textarea.value = "";
          var obj2 = {
            _id: this.$route.query.articleId,
          };
          let result2 = await this.$http("post", "/api/getComment", obj2);
          if (result2.data.code == 101) {
            this.comments = result2.data.comments;
          } else {
            this.$msg.fail("请求出错请重试！");
          }
        } else {
          this.$msg.fail(result.data.message);
        }
      } else {
        this.$msg.fail("评论的内容不能为空哦！！！");
      }
    },
    async deleteComment(id,comId) {
      const userId = sessionStorage.getItem("id")
      if (
         userId == this.article.user_id ||
         userId == comId
      ) {
        this.$Dialog
          .confirm({
            title: "删除",
            message: "确定删除该评论吗？",
          })
          .then(async () => {
            var obj = {
              commentID: id,
            };
            let res = await this.$http("post", "/api/deleteComment", obj);
            this.commentInit();
          })
          .catch(() => {
            // on cancel
          });
      }else{
        return;
      }
    },
    async getArticle(id) {
      const userId = sessionStorage.getItem("id");
      const res = await this.$http("post", "/api/detail?id=" + id);
      if (res.data.code == 101) {
        this.article = res.data.topic;
        if (userId && userId == res.data.topic.user_id) {
          this.isShow = false;
        }
      } else {
        this.$msg.fail("获取帖子失败");
      }
    },
    async deleteArticle() {
      this.$Dialog
        .confirm({
          title: "删除",
          message: "确定删除该文章吗？",
        })
        .then(async () => {
          const res = await this.$http("post", "/api/delete?id=" + this.id);
          if (res.data.code == 101) {
            this.$msg.fail("删除成功");
            setTimeout(() => {
              this.$router.go(-1);
            }, 500);
          } else {
            this.$msg.fail("删除失败");
          }
        })
        .catch(() => {
          // on cancel
        });
    },
    async followWithInsert() {
      if (this.follow == "关注") {
        var friend_username = this.article.username;
        var friend_avatar = this.article.icon;
        var friendID = this.article.user_id;
        var obj = {
          friend_username: friend_username,
          friend_avatar: friend_avatar,
          friendID: friendID,
        };
        let result = await this.$http("post", "/api/addFriend", obj);
        if (result.data.code == 101) {
          this.$msg.fail("关注成功！");
          this.follow = "已关注";
          var obj = {
            friend_id: this.article.user_id,
          };
          let result2 = await this.$http("post", "/api/judgeFriend", obj);
          if (result2.data.code == 101) {
            this.judgeInfor = result2.data.judgeInfor;
          }
        } else {
          this.$router.push("/login");
        }
      } else {
        return;
      }
    },
    async deleteFollow() {
      if (this.follow == "已关注") {
        var friendID = this.article.user_id;
        var obj = {
          friendID: friendID,
          userID: sessionStorage.getItem("id"),
        };
        const res = await this.$http("post", "/api/deletefriend", obj);
        this.follow = "关注";
        this.$msg.fail(res.data.message);
      }
    },
    async followInit() {
      if (sessionStorage.getItem("id")) {
        const id = sessionStorage.getItem("id");
        let obj = {
          userID: id,
        };
        const res = await this.$http("post", "/api/getMyFriends", obj);
        if (res.data.code == 101) {
          this.friends = res.data.friends;
          for (let i = 0; i < this.friends.length; i++) {
            if (this.article.user_id == this.friends[i].friendID) {
              this.follow = "已关注";
            }
          }
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.d-nav {
  background-color: white;
  height: 13.333vw;
  width: 100%;
  position: fixed;
  z-index: 999;
  top: 0vw;
  .d-option {
    width: 8vw;
    height: 8vw;
    margin: 2.667vw;
    overflow: hidden;
    float: left;
    line-height: 8vw;
    font-size: 4vw;
    img {
      width: 100%;
    }
  }
  .d-name {
    padding-left: 14.667vw;
    width: 40vw;
    float: left;
    height: 13.333vw;
    color: black;
    font-size: 4.533vw;
    line-height: 13.333vw;
    text-align: center;
    overflow: hidden;
  }
  .btn {
    width: 18.667vw;
    float: right;
    height: 8vw;
    line-height: 8vw;
    margin: 2.667vw;
    color: rgb(255, 66, 66);
    font-size: 3.733vw;
    text-align: center;
    border: 0.267vw solid rgb(255, 66, 66);
    border-radius: 6.667vw;
  }
}
.swiper {
  width: 95%;
  height: 66.667vw;
  margin: 0 auto;
  margin-top: 14.667vw;
  border-radius: 2.667vw;
  overflow: hidden;
  .my-swipe .van-swipe-item {
    img {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }
}
.title {
  position: relative;
  background: #fbfbfb;
  margin-left: 2.667vw;
  width: 95%;
  font-weight: bold;
  span {
    display: inline-block;

    margin-top: 1.333vw;
  }
}
.desc {
  margin-top: 2.667vw;
  margin-left: 2.667vw;
  width: 95%;
  font-size: 3.2vw;
  background: #fbfbfb;
}
.entry {
  margin-top: 8vw;
  padding: 4vw;
  font-size: 3.2vw;
  line-height: 1.6;
  color: #999;
  border: 0.267vw solid #efefef;
  background: #fbfbfb;
  border-radius: 0.8vw;
}
.botton {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  margin-top: 10px;
  i {
    display: inline-block;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    background: url("../assets/icon/like_icon.png") no-repeat center;
    background-size: cover;
  }
}
.comment {
  margin-top: 10px;
  width: 100%;
  .comment_text {
    width: 100%;
    height: 40px;
    margin-top: 5px;
    input {
      float: left;
      width: 79%;
      margin: 0;
      height: 40px;
      border: 1px solid gray;
    }
    .comment_btn {
      float: left;
      width: 19.5%;
      height: 40px;
      color: black;
      border: 1px solid gray;
    }
  }
  .comment_head {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: white;
    color: black;
    font-weight: 900;
    padding-left: 10px;
  }
  .comment_content {
    width: 100%;
    margin-top: 5px;
    background: white;
    .comment_content_head {
      width: 100%;
      height: 30px;
      .commenter_avatar {
        float: left;
        width: 30px;
        height: 30px;
        margin-left: 20px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .commenter_nickname {
        float: left;
        width: 50%;
        height: 30px;
        margin-left: 10px;
        line-height: 30px;
        font-size: 15px;
        color: rgb(243, 159, 4);
      }
      .commenter_delete {
        display: flex;
        text-align: center;
        align-items: center;
        float: right;
      }
      .commenter_floor {
        float: right;
        font-size: 10px;
        font-weight: 100;
        line-height: 30px;
        margin-right: 10px;
      }
    }
    .commenter_content {
      width: 100%;
      .content {
        width: 80%;
        margin-left: 60px;
      }
    }
    .comment_footer {
      width: 100%;
      .comment_createdtime {
        width: 80%;
        margin-left: 60px;
        font-size: 10px;
        font-weight: 100;
        color: gray;
      }
    }
  }
}
</style>