<template>
  <div v-if="model" class="editView">
    <div style="margin-bottom: 2.778vw">
      <tab-bar></tab-bar>
    </div>
    <div class="uploadfile">
      <div class="uploadimg">
        <van-uploader preview-size="100vw" :after-read="afterRead" />
      </div>
      <edit-banner left="头像">
        <img :src="model.avatar" slot="right" alt="" v-if="model.avatar" />
        <img src="../assets/img/head.jpg" slot="right" alt="" v-else />
      </edit-banner>
    </div>
    <edit-banner left="昵称" @bannerClick="show = true">
      <a href="javascript:;" slot="right">{{ model.username }}</a>
    </edit-banner>
    <edit-banner left="账号">
      <a href="javascript:;" slot="right">{{ model.nickname }}</a>
    </edit-banner>
    <edit-banner left="性别" @bannerClick="gendershow = true">
      <a href="javascript:;" slot="right">{{
        model.gender === 1 ? "男" : "女"
      }}</a>
    </edit-banner>
    <edit-banner left="个性签名" @bannerClick="textshow = true">
      <a href="javascript:;" slot="right">{{ model.bio }}</a>
    </edit-banner>
    <div class="editback" @click="$router.back()">返回个人中心</div>
    <van-dialog
      v-model="show"
      title="昵称"
      show-cancel-button
      @confirm="confirmClick"
      @cancel="content = ''"
    >
      <van-field v-model="content" autofocus />
    </van-dialog>
    <van-dialog
      v-model="textshow"
      title="个性签名"
      show-cancel-button
      @confirm="textareaClick"
      @cancel="content = ''"
    >
      <van-field v-model="content" type="textarea" autofocus />
    </van-dialog>
    <van-action-sheet
      v-model="gendershow"
      cancel-text="取消"
      :actions="actions"
      @select="onSelect"
    />
  </div>
</template>

<script>
import TabBar from "../components/common/TabBar";
import editBanner from "../components/common/editBanner";
export default {
  data() {
    return {
      model: {},
      show: false,
      gendershow: false,
      textshow: false,
      content: "",
      actions: [
        { name: "男", val: 1 },
        { name: "女", val: 0 },
      ],
    };
  },
  components: {
    TabBar,
    editBanner,
  },
  methods: {
    async UserinfoData() {
      if (!sessionStorage.getItem("id")) {
        return;
      } else {
        const id = sessionStorage.getItem("id");
        const res = await this.$http("post", "/api/userinfo/?id=" + id);
        this.model = res.data.user[0];
      }
    },
    async afterRead(file) {
      const fromdata = new FormData();
      fromdata.append("file", file.file);
      const res = await this.$http(
        "post",
        "/api/upload/?id=" + sessionStorage.getItem("id"),
        fromdata
      );
      const avaterUrl = res.data.user.avatar;
      this.model.avatar = avaterUrl;
      this.UserUpdate();
    },
    async UserUpdate() {
      const res = await this.$http(
        "post",
        "/api/update/?id=" + sessionStorage.getItem("id"),
        this.model
      );
      if (res.status === 200) {
        this.$msg.fail("修改成功");
      } else {
        this.$msg.fail("修改失败");
      }
    },
    confirmClick() {
      this.model.username = this.content;
      this.UserUpdate();
      this.content = "";
    },
    textareaClick() {
      this.model.bio = this.content;
      this.UserUpdate();
      this.content = "";
    },
    onSelect(data) {
      this.model.gender = data.val;
      this.UserUpdate();
      this.gendershow = false;
    },
  },
  created() {
    this.UserinfoData();
  },
};
</script>

<style>
.editView a {
  color: #333;
}
.editView img {
  height: 12.778vw;
  width: 12.778vw;
  border-radius: 50%;
}
.uploadfile {
  overflow: hidden;
  position: relative;
}
.uploadimg {
  opacity: 0;
  position: absolute;
}
.editback {
  margin-top: 5.556vw;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  color: #999;
  padding: 4.167vw 0;
  font-size: 4vw;
}
</style>
