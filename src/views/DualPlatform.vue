<script setup lang="ts">

import { onMounted, ref, watch } from "vue";
import { usePageStore } from "../stores/page";
import { APISettings } from "@/api/config";
import type { TabsProps } from "ant-design-vue/lib/tabs/src/Tabs";

import TargetTable from "../components/TargetTable.vue"
import GenTable from "../components/GenTable.vue"
import SelectView from "@/components/SelectView.vue";

import { getUrl, type TableDataType, type TableGenDataType } from "@/common/mode";
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

    watch(left_select, (newValue, oldValue) => {
        // console.log(`Count changed from ${oldValue} to ${newValue}`)
    })

    getData();
});


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
        <a-back-top :visibilityHeight="300" />

        <div style="padding: 0.1rem;" />
        <a-select v-model:value="dual_target" style="width: 10.0rem" placeholder="Dual Taget Select" :options="options"
            @change="handleChange"></a-select>

        <a-radio-group v-if="dual_target" v-model:value="cur_target" @change="targetChange">
            <a-radio-button value="left">{{ dual_target.split("-")[0] }}</a-radio-button>
            <a-radio-button value="right">{{ dual_target.split("-")[1] }}</a-radio-button>
        </a-radio-group>
        <a-row>
            <a-col :span="12">
                <TargetTable v-show="cur_target == 'left'" :data="left_data" v-model:select="left_select" />
                <TargetTable v-show="cur_target == 'right'" :data="right_data" v-model:select="right_select" />
            </a-col>
            <a-col :span="6">
                <SelectView v-if="left_select" v-model:data="left_select" />
            </a-col>
            <a-col :span="6">
                <SelectView v-if="right_select" v-model:data="right_select" />
            </a-col>

        </a-row>
        <div v-if="left_select || right_select" class="select">
            <div>Select:</div>
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
        <a-button @click="clickGen">Generate</a-button>
        <div style="padding: 0.25rem;" />
        <GenTable :data="gen_data" :target="dual_target" />
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
    gap: 0.25rem;
    padding: 16px;
    /* 将子元素水平居中 */
}

.select {
    display: flex;
    flex-direction: row;
    align-items: center;
    /* 将子元素垂直居中 */
    justify-content: center;
    gap: 0.25rem;
    /* 将子元素水平居中 */
}
</style>
