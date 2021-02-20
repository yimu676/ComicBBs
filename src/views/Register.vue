<template>
  <div>
      <login-top Text="注册">
          <div slot="right" style="font-size:3.611vw" @click="$router.push('/login')">登录</div>
      </login-top>
        <login-text label="姓名" 
            style="margin:15.001px 0;" 
            placeholder="请输入姓名"

            @inputChange="res => model.username = res"
            >
        </login-text>

        <login-text label="账号" 
        placeholder="请输入账号"
         @inputChange="res => model.nickname = res"
         >
        </login-text>

        <login-text label="密码" 
            placeholder="请输入密码" 
            type="password"

            @inputChange="res => model.password = res"
        >
        </login-text>

        <login-btn BtnText="注册" @registerSubmit="registerSubmit"></login-btn>
  </div>
</template>

<script>
import LoginTop from '@/components/common/LoginTop.vue'
import LoginText from '@/components/common/LoginText.vue'
import LoginBtn from '@/components/common/LoginBtn.vue'
export default {
    data() {
        return {
            model:{
                username:'',
                nickname:'',
                password:'',
                
            }
        }
    },
    components:{
        LoginTop,
        LoginText,
        LoginBtn
    },
    methods:{
     async registerSubmit(){
        const rulg = /^.{6,16}$/
        if ( rulg.test(this.model.nickname) && rulg.test(this.model.password)) {
        const res = await this.$http('post','/api/register', this.model)
        this.$msg.fail(res.data.msg)
        if (res.data.code === 301 || res.data.code === 302) {
          return
        }
         setTimeout(() => {
          this.$router.push('/login')
        },500)
     }else {
        this.$msg.fail('格式不正确')
      }
     }
    }
}
</script>

<style lang="less">

</style>