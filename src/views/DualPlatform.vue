<script setup lang="ts">

import { onMounted, ref, watch } from "vue";
import { usePageStore } from "../stores/page";
import { APISettings } from "@/api/config";
import type { TabsProps } from "ant-design-vue/lib/tabs/src/Tabs";

import TargetTable from "../components/TargetTable.vue"
import GenTable from "../components/GenTable.vue"

import type { TableDataType, TableGenDataType } from "@/common/mode";
import { message } from "ant-design-vue";

const page = usePageStore();
page.setTitle("Dual Target Drug Design Platform");

const dual_target = ref<string | undefined>(undefined);
const cur_target = ref<TabsProps['tabPosition']>('left');;
const options = ref([]);

const target_data = ref<Map<String, Object>>(new Map());

const left_data = ref();
const left_select = ref<TableDataType | undefined>(undefined);
const right_select = ref<TableDataType | undefined>(undefined);
const right_data = ref();
const gen_data = ref<TableGenDataType[] | undefined>(undefined);

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
        console.log("getTagertInfo error = ", e);
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

    watch(left_select, (newValue, oldValue) => {
        // console.log(`Count changed from ${oldValue} to ${newValue}`)
    })

    getData();
});

function getUrl(url: String) {
    return `${APISettings.baseURL}/${url}`
}

async function clickGen() {
    if (left_select.value && right_select.value) {
        try {
            let res = await fetch(
                `${APISettings.baseURL}/api/dual/${dual_target.value}/${left_select.value.SMILES}/${right_select.value.SMILES}`
            );
            if (res.status == 200) {
                let json = await res.json();
                if (json.ok) {
                    gen_data.value = json.ok;

                    if (json.ok.length == 0) {
                        message.info('未发现可生成的分子');
                    }
                } else {
                }
            }
        } catch (e) {
            console.log("clickGen error = ", e);
        }
    }
}


</script>

<template>
    <div class="main">
        <div style="padding: 0.25rem;" />
        <a-select v-model:value="dual_target" style="width: 10.0rem" placeholder="Dual Taget Select" :options="options"
            @change="handleChange"></a-select>

        <a-radio-group v-if="dual_target" v-model:value="cur_target" :style="{ marginBottom: '8px' }"
            @change="targetChange">
            <a-radio-button value="left">{{ dual_target.split("-")[0] }}</a-radio-button>
            <a-radio-button value="right">{{ dual_target.split("-")[1] }}</a-radio-button>
        </a-radio-group>
        <div style="width: 90%;">
            <TargetTable v-show="cur_target == 'left'" :data="left_data" v-model:select="left_select" />
            <TargetTable v-show="cur_target == 'right'" :data="right_data" v-model:select="right_select" />
        </div>
        <div v-if="left_select || right_select">
            <p> Select: </p>
            <a-space>
                <a-tooltip>
                    <template #title>{{ left_select?.title }}</template>
                    <img v-if="left_select" :src="getUrl(left_select!.img1)" style="height:100px;" />
                </a-tooltip>
                <a-tooltip>
                    <template #title>{{ right_select?.title }}</template>
                    <img v-if="right_select" :src="getUrl(right_select!.img1)" style="height:100px;" />
                </a-tooltip>
            </a-space>

        </div>
        <div style="padding: 0.25rem;" />
        <a-button @click="clickGen">生成</a-button>
        <div style="padding: 0.25rem;" />
        <div style="width: 90%;">
            <GenTable :data="gen_data" :target="dual_target" />
        </div>
        <div style="padding: 0.25rem;" />
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
