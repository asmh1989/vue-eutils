<script setup lang="ts">

import { usePageStore } from "../stores/page";

const page = usePageStore();
page.setTitle("工具大杂烩");


</script>

<template>
    <div style="margin-top: 3rem;">
        <div class="padding">
            <a href="/#/dual" target="_blank" class="text">双靶点平台</a>
            <p>Dual Target Drug Design Platform</p>
        </div>
        <div class="padding">
            <a href="http://192.168.2.212:5432" target="_blank" class="text">Web-ChatGPT</a>
            <p>内部搭建的Chat-GPT平台</p>
        </div>
        <div class="padding">
            <a href="http://192.168.2.27:4321" target="_blank" class="text">PubMed GPT Mining</a>
            <p>基于Pubmed的论文挖掘平台</p>
        </div>
        <div class="padding">
            <a href="http://192.168.2.212:7474" target="_blank" class="text">Knowledge Graph</a>
            <p>Neo4j Web 浏览界面(帐号: aixb/aixb123456)</p>
        </div>
    </div>
</template>

<style>
.padding {
    padding: 1.2rem;
    font-size: 1.2rem;
}
</style>
