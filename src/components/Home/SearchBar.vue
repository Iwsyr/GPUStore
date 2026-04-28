<template>
  <div class="search-bar">
    <input type="text" placeholder="搜索显卡型号">
  </div>
</template>

<script>
export default {
  name: 'SearchBar'
}
</script>

<style scoped>
.search-bar {
  padding: 10px;
  background: #FF0036;
}
.search-bar input {
  width: 100%;
  height: 30px;
  border-radius: 15px;
  padding: 0 15px;
  border: none;
}
</style>