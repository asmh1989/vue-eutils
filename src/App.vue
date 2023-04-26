<script setup lang="ts">
import { RouterView } from "vue-router";
import { usePageStore } from "./stores/page";

const page = usePageStore();
</script>

<template>
  <div class="my-root">
    <a-layout>
      <a-layout-header>
        <div>
          <a-row>
            <a-col :span="2">
              <RouterLink to="/" class="text">Home</RouterLink>
            </a-col>
            <a-col :span="20" class="text"> {{ page.title }} </a-col>
            <a-col :span="2">
              <a href="http://192.168.2.212:5432" target="_blank" class="text">Web-ChatGPT</a>
            </a-col>
          </a-row>
        </div>
      </a-layout-header>
      <a-layout-content>
        <RouterView />
      </a-layout-content>
      <a-layout-footer style="background: #dbdbdb">@AIXB</a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
.my-root {
  display: flex;
  width: 100%;
  text-align: center;
}

.text {
  font-size: 20px;
  /* padding: 1rem; */
  /* color: aliceblue; */
}

.header-home {
  display: block;
}

.ant-layout-header {
  background: #20558a;
  color: white;
}

.ant-layout-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 800px;
  background: white;
}
</style>
