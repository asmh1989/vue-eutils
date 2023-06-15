<script setup lang="ts">
import { APISettings } from '@/api/config';
import { getSmilesUrl, copyToClipboard, type TableDataLinkType } from '@/common/mode';
import type { TableColumnType } from 'ant-design-vue';
import { ref } from 'vue';




const columns: TableColumnType<TableDataLinkType>[] = [
    {
        title: 'name',
        dataIndex: 'Title',
    },
    {
        title: 'struct',
        dataIndex: 'SMILES',
        key: 'img1',
        width: 200,
    },
    {
        title: 'score',
        dataIndex: 'Score',
        sorter: (a: TableDataLinkType, b: TableDataLinkType) => a.Score - b.Score,
        sortDirections: ['descend', 'ascend'],
    }

];

const columns2: TableColumnType<TableDataLinkType>[] = [
    {
        title: 'name',
        dataIndex: 'Title',
    },
    {
        title: 'struct',
        dataIndex: 'SMILES',
        key: 'img1',
        width: 300,
    },
    {
        title: 'score',
        dataIndex: 'Score',
        sorter: (a: TableDataLinkType, b: TableDataLinkType) => a.Score - b.Score,
        sortDirections: ['descend', 'ascend'],
    }

];
interface Props {
    data: TableDataLinkType[]	 // v-model 默认的名字
    target: string;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  target: "",
});

const customKey = ref<TableDataLinkType | undefined>(undefined);

const pair_data = ref<TableDataLinkType[] | undefined>(undefined);


async function getData() {
    try {
        let res = await fetch(
            `${APISettings.baseURL}/api/dual/pair?target=${props.target}&link=${customKey.value?.Title}`
        );

        if (res.status == 200) {
            let json = await res.json();
            if (json.ok) {
                pair_data.value = json.ok
            } else {
            }
        }
    } catch (e) {
        console.log("getdata error = ", e);
    }
}

function rowAction(record: TableDataLinkType, index: number) {
    // console.log("table rowAction " + index)

    return {
        style: {
            'background-color': record.Title == customKey.value?.Title ? 'rgb(0,180,237, 0.1)' : '',
        },
        onClick: (event: any) => {
            // console.log("table onClick " + index)
            customKey.value = record;
            // emit('update:select', record);

            getData();

        },

    }
}


function clickMenu(key: number, text: any) {
    // let data = props.data.find((person => person.Title === text));
    // console.log(`clickMenu key = ${key}, data = ${JSON.stringify(data)}`);
    try {
        if (key == 1) {
            copyToClipboard(text);
        } 
    } catch (e) {
        console.error(`doi err = ${e}`)
    }
}


</script>

<template>

<a-row>
    <a-col :span="1" />
            <a-col :span="10">
                <a-table :columns="columns" :data-source="data" :customRow="rowAction" :scroll="{ y: 640 }" :pagination="false"
            size="small" :bordered="true">
            <template #bodyCell="{ column, text }">

                <template v-if="column.dataIndex === 'SMILES'">
                    <!-- {{ text }} -->
                    <a-dropdown placement="bottom">
                    <img :src="getSmilesUrl(text)" style="height:200px;" />

                    <template #overlay>
                            <a-menu v-if="text.length != 0" @click="(e: any) => {
                                clickMenu(e.key, text);
                            }">
                                <!-- <a-menu-item key="0">
                                    查看
                                </a-menu-item> -->
                                <a-menu-item key="1">
                                    复制
                                </a-menu-item>
                                <!-- <a-menu-item key="2">
                                    DOI
                                </a-menu-item>
                                <a-menu-item key="3">
                                    PatentNumber
                                </a-menu-item> -->
                            </a-menu>
                        </template>
                    </a-dropdown>
                </template>
            </template>
        </a-table>
            </a-col>
            <a-col :span="1" />

            <a-col :span="11">
                <a-table :columns="columns2" :data-source="pair_data"  :scroll="{ y: 640 }" :pagination="false"
            size="small" :bordered="true">
            <template #bodyCell="{ column, text }">

                <template v-if="column.dataIndex === 'SMILES'">
                    <!-- {{ text }} -->
                    <a-dropdown placement="bottom">
                    <img :src="getSmilesUrl(text)" style="height:300px;" />

                    <template #overlay>
                            <a-menu @click="(e: any) => {
                                clickMenu(e.key, text);
                            }">
                                <!-- <a-menu-item key="0">
                                    查看
                                </a-menu-item> -->
                                <a-menu-item key="1">
                                    复制
                                </a-menu-item>
                                <!-- <a-menu-item key="2">
                                    DOI
                                </a-menu-item>
                                <a-menu-item key="3">
                                    PatentNumber
                                </a-menu-item> -->
                            </a-menu>
                        </template>
                    </a-dropdown>
                </template>
            </template>
        </a-table>
            </a-col>

        </a-row>

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