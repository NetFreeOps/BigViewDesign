<template>
  <div class="login-container">
    <el-card class="login-card">
      <h3 class="login-title">天弘实验室大屏展示系统</h3>
      <el-form ref="loginForm" label-position="top">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="width: 100%;text-align: center;">
            <el-button style="width: 200px;" type="primary" size="large" round @click="login">登录</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue';
import {  useRouter } from 'vue-router';

const form = ref({
  username: '',
  password: ''
});



const router = useRouter();




const login = () => {
  // Handle login logic
  //路由跳转
  //router.push('/home');
  router.push('/index')
};
</script>
  
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('../assets/login-bg.png');
  background-size: cover;

}

.login-card {
  width: 400px;
  padding: 20px;
  width: 400px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid #0cb6fa;
  border-radius: 10px;
  box-shadow: 0 0 10px #0cb6fa;
  animation: glowing-border 2s infinite;
}

.login-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}


@keyframes glowing-border {
  0% {
    box-shadow: 0 0 10px #0cb6fa;
  }

  50% {
    box-shadow: 0 0 20px #0cb6fa;
  }

  100% {
    box-shadow: 0 0 10px #0cb6fa;
  }
}
</style>