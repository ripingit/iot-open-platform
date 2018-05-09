<template>
  <div class="layout">
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
  .container {
    overflow-x: hidden;
    width: auto;
  }

  @media (min-width: 1366px) {
    .layout{
      overflow: hidden;
      height: 100%;
      background:#292c31;
    }
    .container {
      margin-right: -1.5rem;
      height: 100%;
      overflow-y: scroll;
    }
  }
  @media (max-width: 1366px) {
    .layout {
      padding-bottom: 4000px;
      margin-bottom: -4000px;
      background:#292c31;
      height: 100%;
      overflow: auto;
    }
  }
</style>
