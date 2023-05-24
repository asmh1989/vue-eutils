<script setup lang="ts">
import { APISettings } from '@/api/config';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { ref } from 'vue';

type TableDataType = {
    SMILES: string;
    img1: string;
    img2: string;
    mean: number;
    median: number;
    std: number;
    title: string;
};

const columns: TableColumnType<TableDataType>[] = [
    {
        title: 'name',
        dataIndex: 'title',
    },
    {
        title: 'struct',
        dataIndex: 'img1',
        key: 'img1'
    },
    {
        title: 'mean',
        dataIndex: 'mean',
        sorter: (a: TableDataType, b: TableDataType) => a.mean - b.mean,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'median',
        dataIndex: 'median',
        sorter: (a: TableDataType, b: TableDataType) => a.median - b.median,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'std',
        dataIndex: 'std',
        sorter: (a: TableDataType, b: TableDataType) => a.std - b.std,
        sortDirections: ['descend', 'ascend'],
    },

];

const onChange: TableProps<TableDataType>['onChange'] = (pagination, filters, sorter) => {
    console.log('params', pagination, filters, sorter);
};

interface Props {
    data: object[]	 // v-model 默认的名字
    select: string
}

const props = withDefaults(defineProps<Props>(), {
    data: () => [],
    select: ''
})

const emit = defineEmits(['update:select'])

function handleChange(val: any) {
    // 触发改变绑定值
    emit('update:select', val);
}

function getUrl(url: String) {
    return `${APISettings.baseURL}/${url}`
}

</script>

<template>
    <a-table :columns="columns" :data-source="data" @change="onChange" :scroll="{ y: 480 }">
        <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'img1'">
                <!-- {{ text }} -->
                <img :src="getUrl(text)" style="height:100px;" />
            </template>
        </template>
    </a-table>
</template>

<style></style>