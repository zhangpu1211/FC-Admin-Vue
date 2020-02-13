<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :rules="rules"
      :model="loginForm"
      class="login-form"
    >
      <h3 class="title">系统登陆</h3>
      <el-form-item prop="username">
        <span class="svg-container"><icon-svg icon-class="yonghu" /></span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="2"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container"><icon-svg icon-class="mima" /></span>
        <el-input
          ref="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
          :type="passwordType"
          name="password"
          tabindex="2"
          auto-complete="off"
          @keyup.enter.native="submitLogin"
        />
        <span class="show-pwd" @click="showPwd"><icon-svg :icon-class="passwordType === 'password' ? 'buxianshimima' : 'eye'" /></span>
      </el-form-item>
      <el-button
        v-loading="loading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        size="normal"
        type="primary"
        style="width: 100%;"
        @click="submitLogin"
      >登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
import Login from '../models/Login'
export default {
  name: 'Login',
  data() {
    return {
      passwordType: 'password',
      loading: false,
      loginForm: {
        username: '1',
        password: '12'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async submitLogin() {
      this.$refs.loginForm.validate(async(valid) => {
        if (valid) {
          const resp = await Login.doLogin(this.loginForm)
          if (resp) {
            window.sessionStorage.setItem('user', JSON.stringify(resp.obj))
            const path = this.$route.query.redirect
            console.log(path)
            this.$router.replace(
              path === '/' || path === undefined ? '/home' : path
            )
          }
        } else {
          this.$message({
            showClose: true,
            message: '请输入用户名或密码',
            type: 'error'
          })
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 92%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      font-size: 16px;
      display: inline-block;
    }
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;

    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
