<script setup lang="ts">
import { APISettings } from '@/api/config';
import type { TableGenDataType } from '@/common/mode';

import { type TableColumnType, type TableProps, message } from 'ant-design-vue';
import { onBeforeUpdate, ref } from 'vue';

import Doi from './Doi.vue'

let columns: TableColumnType<TableGenDataType>[] = [
    {
        title: 'struct',
        dataIndex: 'SMILES',
        key: 'smiles',
        width: 240,
        fixed: 'left'
    },
    {
        title: 'left_struct',
        dataIndex: 'Left_Frag',
        width: 240,
    },
    {
        title: 'right_struct',
        dataIndex: 'Right_Frag',
        key: 'smiles',
        width: 240,
    },
    {
        title: 'left_mean',
        dataIndex: 'Left_mean',
        sorter: (a: TableGenDataType, b: TableGenDataType) => a.Left_mean - b.Left_mean,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'left_median',
        dataIndex: 'Left_median',
        sorter: (a: TableGenDataType, b: TableGenDataType) => a.Left_median - b.Left_median,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'left_std',
        dataIndex: 'Left_std',
        sorter: (a: TableGenDataType, b: TableGenDataType) => a.Left_std - b.Left_std,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'right_mean',
        dataIndex: 'Right_mean',
        sorter: (a: TableGenDataType, b: TableGenDataType) => a.Right_mean - b.Right_mean,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'right_median',
        dataIndex: 'Right_median',
        sorter: (a: TableGenDataType, b: TableGenDataType) => a.Right_median - b.Right_median,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'right_std',
        dataIndex: 'Right_std',
        sorter: (a: TableGenDataType, b: TableGenDataType) => a.Right_std - b.Right_std,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'left_doi',
        dataIndex: 'Left_ArticleDOI',
        width: 100
    },
    {
        title: 'right_doi',
        dataIndex: 'Right_ArticleDOI',
    },

];

const onChange: TableProps<TableGenDataType>['onChange'] = (pagination, filters, sorter) => {
    console.log('params', pagination, filters, sorter);
};

interface Props {
    data: TableGenDataType[]	 // v-model 默认的名字
    target: string
}

const props = withDefaults(defineProps<Props>(), {
    data: () => [],
    target: ''
})

onBeforeUpdate(() => {
    if (props.target.length > 0) {
        // console.log("gen onMounted ...", props.data);

        let nn = props.target.split('-');
        columns.forEach(f => {
            let title = f.title as string;
            if (title.startsWith('left')) {
                f.title = title.replace("left", nn[0]);
            } else if (title.startsWith('right')) {
                f.title = title.replace("right", nn[1]);
            }
        })
    }
});
// const emit = defineEmits(['update:select'])
// const customKey = ref('');
const modalVisble = ref(false);
const modalImg = ref('');


function getUrl(url: String) {
    let data = props.data.find((person => person.SMILES === url));
    return `${APISettings.baseURL}/dual/${props.target}/GenCPDs/Struct/${data?.title}.png`
}

function getUrl2(url: String, left: boolean) {
    let nn = props.target.split('-');
    let n = nn[0];
    if (!left) {
        n = nn[1];
    }
    return `${APISettings.baseURL}/dual/${props.target}/${n}/Motifs-R/Smi_${url}.png`
}

function getUrl3(url: String, left: boolean) {
    let nn = props.target.split('-');
    let n = nn[0];
    if (!left) {
        n = nn[1];
    }
    return `${APISettings.baseURL}/dual/${props.target}/${n}/Motifs-R/Smi_${url}_dist.png`
}

function clickMenu(key: number, text: any) {
    // let data = props.data.find((person => person.img1 === text));
    // console.log(`clickMenu key = ${key}, data = ${JSON.stringify(data)}`);

    if (key == 0) {
        // modalImg.value = getUrl(data!.img2);
        // modalVisble.value = true;
    } else if (key == 1) {
        navigator.clipboard.writeText(text)
            .then(() => message.success('Smiles已复制到剪贴板'))
            .catch(err => message.error('Failed to copy text: ', err))
    }
}

function clickMenu1(key: number, text: any, index: string, left: boolean) {
    let data = props.data.find(person => (person as any)[index] == text);
    console.log(`clickMenu key = ${key}, data = ${JSON.stringify(data)}`);

    if (key == 0) {
        modalImg.value = getUrl3((data as any)[index], left);
        modalVisble.value = true;
    } else if (key == 1) {
        navigator.clipboard.writeText(text)
            .then(() => message.success('Smiles已复制到剪贴板'))
            .catch(err => message.error('Failed to copy text: ', err))
    }
}

const handleCancel = () => {
    modalVisble.value = false;
};

function toArray(text: string) {
    try {
        console.log('text', JSON.parse(text));
        return JSON.parse(text);
    } catch (e) {
        return [];
    }
}


</script>

<template>
    <main>
        <a-table :columns="columns" :data-source="data" :scroll="{ y: 480, x: 1500 }" :pagination="false" :bordered="true">
            <template #bodyCell="{ column, text }">

                <template v-if="column.dataIndex === 'SMILES'">
                    <a-dropdown placement="topLeft">
                        <img :src="getUrl(text)" style="width:100%;" />

                        <template #overlay>
                            <a-menu @click="(e: any) => {
                                clickMenu(e.key, text);
                            }">
                                <a-menu-item key="1">
                                    复制
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </template>

                <template v-if="column.dataIndex === 'Left_Frag'">
                    <a-dropdown placement="topLeft">
                        <img :src="getUrl2(text, true)" style="width:100%;" />

                        <template #overlay>
                            <a-menu @click="(e: any) => {
                                clickMenu1(e.key, text, column.dataIndex, true);
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

                <template v-if="column.dataIndex === 'Right_Frag'">
                    <a-dropdown placement="topLeft">
                        <img :src="getUrl2(text, false)" style="width:100%;" />

                        <template #overlay>
                            <a-menu @click="(e: any) => {
                                clickMenu1(e.key, text, column.dataIndex, false);
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

                <template v-if="column.dataIndex === 'Right_ArticleDOI'">
                    <Doi :text="text" />
                </template>
                <template v-if="column.dataIndex === 'Left_ArticleDOI'">
                    <Doi :text="text" />
                </template>
            </template>



        </a-table>
        <a-modal v-model:visible="modalVisble">
            <template #footer>
                <a-button key="submit" @click="handleCancel">Ok</a-button>
            </template>
            <img :src="modalImg" style="width:100%;" />
        </a-modal>
    </main>
</template>

<style></style>