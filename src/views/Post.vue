<template>
  <div>
    <tab-bar />
    <div class="p-main">
      <div class="p-title">
        <input
          type="text"
          ref="title"
          placeholder="填写标题会吸引更多关注奥 ~"
        />
      </div>
      <div class="p-content">
        <textarea
          id="editor"
          name="editor"
          placeholder="有什么新鲜事？说说吧！"
        ></textarea>
      </div>
      <div class="p-img">
        <van-uploader
          v-model="fileList"
          multiple
          :max-count="9"
          preview-size="100px"
          :after-read="afterRead"
          image-fit="contain"
        />
      </div>
      <div class="p-classify">
        <div class="c-text">分类</div>
        <div class="c-tags">
          <select name="plate" id="plate" ref="plate">
            <option value="0">国漫</option>
            <option value="1">日漫</option>
            <option value="2">美漫</option>
          </select>
        </div>
      </div>
    </div>
    <login-btn BtnText="发表" @registerSubmit="postBtn"></login-btn>
    <botton />
  </div>
</template>

<script>
import TabBar from "../components/common/TabBar";
import Botton from "../components/common/Botton";
import LoginBtn from "../components/common/LoginBtn.vue";

export default {
  components: { TabBar, Botton, LoginBtn },
  data() {
    return {
      user: [],
      img_src: [],
      fileList: [],
    };
  },
  methods: {
    afterRead() {},
    async postBtn() {
      var plate = this.$refs.plate.value;
      var title = this.$refs.title.value;
      var content = document.getElementById("editor").value;
      var i = this.fileList;
      let params = new FormData();
      params.append("plate", plate);
      params.append("title", title);
      params.append("content", content);
      i.map((item) => {
        var img = item.file;
        params.append("file", img);
      });
      let res = await this.$http("post", "/api/post", params, {
        headers: { "Content-Type": "multipart/form-data" },
      });
        if (res.data.code == 101) {
          this.$msg.fail(res.data.message);
          this.$router.push('/home');
        }else{
           this.$msg.fail(res.data.message);
        }
        title = null;
        content = null;
        this.fileList = null;

    },
    showArctile(){
      this.$EventBus.$on('updateArticle', val=>{
      this.fileList = val.img_src
      console.log(val);
      console.log(this.$refs.plate);
      this.$refs.plate.value= val.plate 
      this.$refs.title.value = val.title  
      document.getElementById("editor").value = val.content  
     })
    }
  },
  async created() {
   if (sessionStorage.getItem("id")) {
      const id = sessionStorage.getItem("id");
    const res = await this.$http("post", "/api/userinfo/?id=" + id);
    if (res.data.user[0]) {
      this.user = res.data.user[0];
    }
    if (this.user == "") {
      this.$router.push("/login");
    }
   }else{
     return
   }
  },
   mounted () {
      this.showArctile()
  }
};
</script>

<style  lang="less" scoped>
.p-main {
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 8px;
  height: 100%;
  width: 100%;
  .p-img {
    margin-top: 10px;
    padding: 5px;

    background-color: white;
  }
  input::-webkit-input-placeholder {
    /* WebKit browsers 适配谷歌 */
    text-align: start;
  }
  .p-title {
    height: 50px;
    margin-top: 10px;
    input[type="text"] {
      width: 95%;
      border: none;
      height: 50px;
      line-height: 40px;
      color: black;
    }
  }
  .p-content {
    margin-top: 10px;
    width: 100%;
    height: 250px;
    textarea {
      border: none;
      width: 95%;
      height: 100%;
      color: gray;
    }
  }
  .p-classify {
    width: 100%;
    height: 50px;
    margin-top: 10px;
    font-size: 18px;
    background-color: white;
    select:focus {
      outline: none;
    }
    .c-text {
      padding-left: 5px;
      width: 100px;
      height: 50px;
      float: left;
      line-height: 50px;
    }
    .c-tags {
      width: 100px;
      height: 50px;
      float: right;
      border-radius: 25px;
      select {
        margin: 0;
        padding: 0;
        line-height: 50px;
        font-size: 18px;
        appearance: none;
        border: none;
      }
    }
  }
}
</style>
