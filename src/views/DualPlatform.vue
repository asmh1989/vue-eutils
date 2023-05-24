<script setup lang="ts">

import { onMounted, ref } from "vue";
import { usePageStore } from "../stores/page";
import { APISettings } from "@/api/config";
import type { TabsProps } from "ant-design-vue/lib/tabs/src/Tabs";

import TargetTable from "../components/TargetTable.vue"

const page = usePageStore();
page.setTitle("Dual Target Drug Design Platform");

const dual_target = ref<String>("");
const cur_target = ref<TabsProps['tabPosition']>('left');;
const options = ref([]);

const target_data = ref<Map<String, Object>>(new Map());

const left_data = ref();
const left_select = ref();
const right_select = ref();
const right_data = ref();

async function getData() {
    try {
        let res = await fetch(
            `${APISettings.baseURL}/api/dual/list`
        );

        if (res.status == 200) {
            let json = await res.json();
            if (json.ok) {
                options.value = json.ok.map((v: any) => ({ value: v, key: v }));
            } else {
            }
        }
    } catch (e) {
        console.log("getdata error = ", e);
    }
}

async function getTagertInfo(dual: String, left: number) {
    const k = `${dual}/${left}`;

    if (target_data.value.has(k)) {
        return;
    }

    try {
        let res = await fetch(
            `${APISettings.baseURL}/api/dual/${k}`
        );
        if (res.status == 200) {
            let json = await res.json();
            if (json.ok) {
                target_data.value.set(k, json.ok);
            } else {
            }
        }
    } catch (e) {
        console.log("getdata error = ", e);
    }
}

async function handleChange(value: String) {
    console.log(`handleChange ${cur_target.value} ${value}`);
    await getTagertInfo(value, 0);
    await getTagertInfo(value, 1);

    console.log(target_data.value);
    left_data.value = target_data.value.get(`${value}/0`);
    right_data.value = target_data.value.get(`${value}/1`);

    console.log(left_data.value);

}

function targetChange(value: String) {
    console.log(`targetChange ${cur_target.value} `);
}
onMounted(() => {
    console.log("onMounted ...");

    getData();
});

</script>

<template>
    <div class="main">
        <div style="padding: 0.25rem;" />
        <a-select v-model:value="dual_target" style="width: 10.0rem" placeholder="Dual Taget Select" :options="options"
            @change="handleChange"></a-select>

        <a-radio-group v-if="dual_target.length != 0" v-model:value="cur_target" :style="{ marginBottom: '8px' }"
            @change="targetChange">
            <a-radio-button value="left">{{ dual_target.split("-")[0] }}</a-radio-button>
            <a-radio-button value="right">{{ dual_target.split("-")[1] }}</a-radio-button>
        </a-radio-group>
        <TargetTable v-show="cur_target == 'left'" :data="left_data" :select="left_select" />
        <TargetTable v-show="cur_target == 'right'" :data="right_data" :select="right_select" />

    </div>
</template>

<style>
.main {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 将子元素垂直居中 */
    justify-content: center;
    gap: 0.4rem;
    /* 将子元素水平居中 */
}
</style>
