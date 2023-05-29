<script setup lang="ts">
import { getDoiUrl, type TableGenDataType } from '@/common/mode';
import { onMounted, ref } from 'vue';

interface Props {
    text: Object
    dataIndex: string
}

const props = withDefaults(defineProps<Props>(), {
    text: undefined,
    dataIndex: ''
})

const vv = ref<string[]>([])
const num = ref<string[]>([])

onMounted(() => {
    // console.log(`doi text = `, props.text)

    try {
        let pp = props.text as TableGenDataType;

        let t = pp.Left_ArticleDOI.replace(/'/g, '"');
        let s = pp.Left_PatentNumber.replace(/'/g, '"');
        if (props.dataIndex == 'Left_ArticleDOI') {
            t = pp.Left_ArticleDOI.replace(/'/g, '"');
        } else {
            t = pp.Right_ArticleDOI.replace(/'/g, '"');

            s = pp.Right_PatentNumber.replace(/'/g, '"');
        }

        vv.value = JSON.parse(t);
        num.value = JSON.parse(s);
    } catch (e) {
        console.error(`doi err = ${e}`)
    }
});
const modalVisble = ref(false);
const visible2 = ref(false);
function handleCancel() {
    modalVisble.value = false;
}
function click1() {
    modalVisble.value = true;
    visible2.value = true;
}

function click2() {
    modalVisble.value = true;
    visible2.value = false;
}

</script>

<template>
    <div class="main3">
        <template v-if="num.length > 0">
            <a-button type="link" @click="click1">PARENT_NUM</a-button>
        </template>

        <template v-if="vv.length > 0">
            <a-button type="link" @click="click2">DOI</a-button>
        </template>

        <a-modal v-model:visible="modalVisble">
            <template #footer>
                <a-button key="submit" @click="handleCancel">Ok</a-button>
            </template>

            <div class="main3">
                <template v-if="visible2" v-for="site in num">
                    {{ site }},
                </template>

                <template v-if="!visible2" v-for="site in vv">
                    <a :href="getDoiUrl(site)" target="_blank" class="marquee">{{ site }}</a>
                </template>
            </div>
        </a-modal>

    </div>
</template>

<style>
.main3 {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 将子元素垂直居中 */
    justify-content: center;
    /* 将子元素水平居中 */
}
</style>
