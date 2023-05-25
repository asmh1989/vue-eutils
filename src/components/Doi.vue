<script setup lang="ts">
import { getDoiUrl } from '@/common/mode';
import { onMounted, ref } from 'vue';

interface Props {
    text: string
}

const props = withDefaults(defineProps<Props>(), {
    text: '[]',
})

const vv = ref<string[]>([])

onMounted(() => {

    try {
        let t = props.text.replace(/'/g, '"');
        // console.log(`text = ${props.text.replace(/'/g, '"')}`)
        vv.value = JSON.parse(t);
    } catch (e) {

    }
});

</script>

<template>
    <template v-for="site in vv">
        <a :href="getDoiUrl(site)" target="_blank">{{ site }}</a>
    </template>
</template>

<style></style>
