<template>
  <div>
    <login-top Text="登录">
      <div
        slot="left"
        style="font-size: 3.611vw"
        @click="$router.go(-1)"
      >
        返回
      </div>
      <div
        slot="right"
        style="font-size: 3.611vw"
        @click="$router.push('/register')"
      >
        注册
      </div>
    </login-top>

    <login-text
      label="账号"
      placeholder="请输入账号"
      @inputChange="(res) => (model.nickname = res)"
      style="margin: 4.167vw 0"
    >
    </login-text>

    <login-text
      label="密码"
      placeholder="请输入密码"
      type="password"
      @inputChange="(res) => (model.password = res)"
    >
    </login-text>

    <login-btn BtnText="登录" @registerSubmit="registerSubmit"></login-btn>
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
        if (rulg.test(this.model.nickname) && rulg.test(this.model.password)) {
        const res = await this.$http('post','/api/login', this.model)
        this.$msg.fail(res.data.msg)
        if (res.data.code === 301 || res.data.code === 302) {
          return
        }
          sessionStorage.setItem('id', res.data.user._id)
          setTimeout(() => {
          this.$router.push('/home')
        },500)
      } else {
        this.$msg.fail('格式不正确')
        }
        }
    }
}
</script>

<style>
</style>