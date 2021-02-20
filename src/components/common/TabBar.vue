<template>
  <div class="NavBar">
    <div>
      <img src="../../assets/img/logo.png"
           alt=""
           @click="$router.push('/')">
    </div>
    <div>
      <div>
        <van-icon name="search"
                  class="iconNav"
                  @click="$router.push('/search')" />
      </div>
    </div>
    <div>
      <img :src="imgUrl"
           alt=""
           @click="change"
           v-if="imgUrl">
      <img src="../../assets/img/avatar-default.png"
           alt=""
           @click="$router.push('/login')"
           v-else>
      <div>下载App</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgUrl: ''
    }
  },
  methods:{
     async NavInit () {
      if (sessionStorage.getItem('id')) {
       const id =sessionStorage.getItem('id')
       const res = await this.$http('post','/api/userinfo/?id='+id )
        this.imgUrl = res.data.user[0].avatar
      }else{
        return
      }
    },
     change(){
        if(this.imgUrl){
          this.$router.push({path: '/loginout', query:{imgUrl:this.imgUrl}})
        }else{
          this.$router.push('/login')
        }
    }
  },
  created() {
         this.NavInit()
  },
  mounted () {
    this.$EventBus.$on('loginout', val=>{
       this.imgUrl = val      
     })
  }

}
</script>

<style scoped lang="less">
.NavBar {
  height: 13.056vw;
  display: flex;
  background-color: white;
  div:nth-child(1) {
    width: 25vw;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 47px;
      width: 100%;
      border-radius: 0;
    }
  }
  div:nth-child(2) {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1.389vw;
    div {
      background-color: #f4f4f4;
      height: 6.667vw;
      width: 100%;
      border-radius: 3.333vw;
      position: relative;
      .iconNav {
        color: #aaa;
        position: absolute;
        left: 2.778vw;
        top: 50%;
        transform: translate(0, -50%);
      }
    }
  }
  div:nth-child(3) {
    display: flex;
    justify-content: center;
    align-items: center;

    > div {
      margin: 0 2.778vw;
      font-size: 3.611vw;
      background-color: #fb7299;
      padding: 1.389vw 2.778vw;
      text-align: center;
      border-radius: 0.833vw;
      color: white;
    }
    img {
      width: 6.944vw;
      height: 6.944vw;
    }
  }
}
</style>