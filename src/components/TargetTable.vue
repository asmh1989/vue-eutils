<script setup lang="ts">
import { APISettings } from '@/api/config';
import { copyToClipboard, type TableDataType } from '@/common/mode';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { ref } from 'vue';



const columns: TableColumnType<TableDataType>[] = [
    {
        title: 'name',
        dataIndex: 'title',
    },
    {
        title: 'struct',
        dataIndex: 'img1',
        key: 'img1',
        width: 240,
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
    data: TableDataType[]	 // v-model 默认的名字
    select: TableDataType | undefined
}

const props = withDefaults(defineProps<Props>(), {
    data: () => [],
    select: undefined
})

const emit = defineEmits(['update:select'])
const customKey = ref('');
const modalVisble = ref(false);
const modalImg = ref('');


function handleChange(val: any) {
    // 触发改变绑定值
    emit('update:select', val);
}

function getUrl(url: String) {
    return `${APISettings.baseURL}/${url}`
}

function rowAction(record: TableDataType, index: number) {
    // console.log("table rowAction " + index)

    return {
        style: {
            'background-color': record.title == customKey.value ? 'rgb(0,180,237, 0.1)' : '',
        },
        onClick: (event: any) => {
            // console.log("table onClick " + index)
            customKey.value = record.title;
            emit('update:select', record);

        },

    }
}

function clickMenu(key: number, text: any) {
    let data = props.data.find((person => person.img1 === text));
    console.log(`clickMenu key = ${key}, data = ${JSON.stringify(data)}`);

    if (key == 0) {
        modalImg.value = getUrl(data!.img2);
        modalVisble.value = true;
    } else if (key == 1) {

        copyToClipboard(data!.SMILES);
        // navigator.clipboard.writeText(data!.SMILES)
        //     .then(() => message.success('Smiles已复制到剪贴板'))
        //     .catch(err => message.error('Failed to copy text: ', err))
    }
}

const handleCancel = () => {
    modalVisble.value = false;
};

</script>

<template>
    <main>
        <a-table :columns="columns" :data-source="data" :customRow="rowAction" :scroll="{ y: 420 }" :pagination="false"
            :bordered="true">
            <template #bodyCell="{ column, text }">

                <template v-if="column.dataIndex === 'img1'">
                    <!-- {{ text }} -->
                    <a-dropdown placement="topLeft">
                        <img :src="getUrl(text)" style="width:100%;" />

                        <template #overlay>
                            <a-menu @click="(e: any) => {
                                clickMenu(e.key, text);
                            }">
                                <a-menu-item key="0">
                                    查看
                                </a-menu-item>
                                <a-menu-item key="1">
                                    复制
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </template>


            </template>



        </a-table>
        <a-modal v-model:visible="modalVisble">
            <template #footer>
                <a-button key="submit" @click="handleCancel">Ok</a-button>
            </template>
            <img :src="modalImg" style="height:400px;" />
        </a-modal>
    </main>
</template>

<style></style>