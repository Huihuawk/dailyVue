<template>
  <div id="app">
    <div class="global-header">
      <a href="" id="forkme_banner" target="_blank"><span>View on Github</span></a>
      <div class="wrap">
        <router-link :to="{path: '/'}">
          <img src="" alt="logo">
        </router-link>
        <p class="power">zzzzzzzzzzzz</p>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style>
  @import "../public/css/index/index.css";
</style>
