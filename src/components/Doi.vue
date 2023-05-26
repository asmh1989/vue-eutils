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

</script>

<template>
    <template v-for="site in num">
        <p class="marquee">{{ site }}</p>
    </template>

    <template v-for="site in vv">
        <a :href="getDoiUrl(site)" target="_blank" class="marquee">{{ site }}</a>
    </template>
</template>

<style>
.marquee {
    /* display: inline-block; */
    /* white-space: nowrap; */
    overflow: hidden;
    text-overflow: ellipsis;
    /* animation: marquee 5s linear infinite; */
}

/* @keyframes marquee {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-100%);
    }
} */
</style>
