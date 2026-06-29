<template>
  <div class="error-page">
    <h1>404</h1>
    <p>页面未找到</p>
    <p>内容地址错误</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage'
}
</script>

<style scoped>
.error-page {
  text-align: center;
  padding-top: 100px;
}
.error-page h1 {
  font-size: 100px;
  color: #f56c6c;
}
.error-page p {
  font-size: 20px;
  margin: 20px 0;
}
</style>