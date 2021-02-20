<template>
  <div>
      <img class="headimg" :src="this.imgUrl" alt="">
      <login-btn BtnText="退出登录" @registerSubmit="logoutSubmit"></login-btn>
      <login-btn BtnText="修改密码" @registerSubmit="changeSubmit"></login-btn>
      <login-btn BtnText="返回首页" @registerSubmit="returnSubmit"></login-btn>
       <van-dialog v-model="show"
                title="新密码"
                show-cancel-button
                type="password"
                @confirm="confirmClick"
                @cancel="content=''">
      <van-field v-model="content"
                 autofocus />
    </van-dialog>
  </div>
</template>

<script>
import LoginBtn from '@/components/common/LoginBtn.vue'
import LoginText from '@/components/common/LoginText.vue'
export default {
  data () {
    return{
      imgUrl:'',
      show:false,
      content:''
    }
  },
  components:{
        LoginBtn,
        LoginText,
    },
    created() {
      this.imgUrl = this.$route.query.imgUrl
    },
    methods:{
      async logoutSubmit(){
      const id =sessionStorage.getItem('id')
      const res = await this.$http('post','/api/loginout/?id='+id )
      this.$msg.fail(res.data.msg)
      sessionStorage.removeItem("id")
      this.$EventBus.$emit('loginout','')
      setTimeout(() => {
          this.$router.push('/home')
        },500)
      },
      async confirmClick(){
        const rulg = /^.{6,16}$/
        if ( rulg.test(this.content)) {
           const res = await this.$http('post','/api/change',{content:this.content})
           this.$msg.fail(res.data.msg)
           this.content=''
        }else{
           this.$msg.fail('格式不正确')
        }
       
      },
      changeSubmit(){
        this.show = true
      },
      returnSubmit(){
        this.$router.push('/home')
      }
    }
}
</script>

<style scoped lang="less">
   .headimg {
     margin-top: 150px;
       margin-left: 40vw;
       width: 23.333vw;
       height: 23.333vw;
       border-radius:50%;
   }


</style>