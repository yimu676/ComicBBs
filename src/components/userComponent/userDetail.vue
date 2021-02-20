<template>
  <div class="userdetail">
    <div>
      <div class="user_img">
        <img v-if="!userInfo" src="../../assets/img/head.jpg" alt />
        <img v-else :src="userInfo.avatar" alt="" />
      </div>
      <div class="user_edit">
        <div>
          <p>
            <span>{{ fans }}</span>
            <span class="user_text">粉丝</span>
          </p>
          <p>
            <span>{{ follow }}</span>
            <span class="user_text">关注</span>
          </p>
          <p>
            <span>{{ likeNum }}</span>
            <span class="user_text">喜欢</span>
          </p>
        </div>
        <div @click="$router.push('useredit')">
          <div class="user_editBtn">编辑资料</div>
        </div>
      </div>
    </div>
    <div>
      <h2>{{ userInfo.username }}</h2>

      <p>{{ userInfo.bio }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userInfo: {
      type: Object,
    },
  },
  data() {
    return {
      follow: 0,
      fans: 0,
      likeNum: 0,
    };
  },
  created() {
    this.getInit();
  },
  methods: {
    async getInit() {
      if (sessionStorage.getItem("id")) {
        const id = sessionStorage.getItem("id");
        let obj = {
          userID: id,
        };
        const res = await this.$http("post", "/api/getMyFriends", obj);
        this.follow = res.data.friends.length;
        const res2 = await this.$http("post", "/api/getMyFans", obj);
        this.fans = res2.data.Fans.length;
        const res3 = await this.$http("post", "/api/arctcleid?id=" + id);
        var topics = res3.data.topics
        for (let i = 0; i < topics.length; i++) {
          this.likeNum+=topics[i].likeNum         
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
.userdetail {
  background-color: white;
  padding: 2vw 3.333vw;
  > div:nth-child(1) {
    display: flex;
    .user_img {
      margin-right: 5.556vw;
      img {
        height: 23.611vw;
        width: 23.611vw;
        border-radius: 50%;
      }
    }
    .user_edit {
      flex: 1;
      margin-top: 15px;
      div:nth-child(1) {
        display: flex;
        p {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          font-size: 3.611vw;
          .user_text {
            color: #aaa;
          }
        }
        p:nth-child(1),
        p:nth-child(2) {
          border-right: 0.278vw solid #ccc;
        }
      }
      div:nth-child(2) {
        padding: 0.556vw 2.778vw;
        .user_editBtn {
          border: 0.278vw solid #fb7a9f;
          padding: 0.833vw;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fb7a9f;
          border-radius: 1.111vw;
        }
      }
    }
  }
  > div:nth-child(2) {
    h2 {
      margin: 2.778vw 0 0.833vw 0;
      font-weight: 400;
    }
    p {
      padding: 0;
      margin: 2.778vw 0 0 0;
      color: #999;
    }
  }
}
</style>
