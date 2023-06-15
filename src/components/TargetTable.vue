<script setup lang="ts">
import { getUrl,getSmilesUrl, copyToClipboard, type TableDataType } from '@/common/mode';
import { message, type TableColumnType, type TableProps } from 'ant-design-vue';
import { onMounted, ref } from 'vue';



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

const columns2: TableColumnType<TableDataType>[] = [
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
        sorter: (a: TableDataType, b: TableDataType) => a.Score! - b.Score!,
        sortDirections: ['descend', 'ascend'],
    }

];

const onChange: TableProps<TableDataType>['onChange'] = (pagination, filters, sorter) => {
    console.log('params', pagination, filters, sorter);
};

interface Props {
    data: TableDataType[]	 // v-model 默认的名字
    select: TableDataType | undefined
    isLink: boolean
}

const props = withDefaults(defineProps<Props>(), {
    data: () => [],
    select: undefined,
    isLink: false,
})

const emit = defineEmits(['update:select'])
const customKey = ref('');
const modalVisble = ref(false);
const modalImg = ref('');


function handleChange(val: any) {
    // 触发改变绑定值
    emit('update:select', val);
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

function rowAction2(record: TableDataType, index: number) {
    // console.log("table rowAction " + index)

    return {
        style: {
            'background-color': record.Title == customKey.value ? 'rgb(0,180,237, 0.1)' : '',
        },
        onClick: (event: any) => {
            // console.log("table onClick " + index)
            customKey.value = record.Title!;
            emit('update:select', record);

        },

    }
}

function clickMenu(key: number, text: any) {
    let data = props.data.find((person => person.img1 === text));
    console.log(`clickMenu key = ${key}, data = ${JSON.stringify(data)}`);
    vv.value = [];
    num.value = [];
    try {
        let pp = data!;
        let t = pp.ArticleDOI.replace(/'/g, '"');
        let s = pp.PatentNumber.replace(/'/g, '"');
        if (key == 0) {
            modalImg.value = getUrl(data!.img2);
            modalVisble.value = true;
        } else if (key == 1) {
            copyToClipboard(data!.SMILES);
        } else if (key == 2) {
            let ss = JSON.parse(t);
            if (ss.length == 0) {
                message.info("empty!");
            } else {
                vv.value = ss;
                modalVisble.value = true;
            }
        } else if (key == 3) {
            let ss = JSON.parse(s);
            if (ss.length == 0) {
                message.info("empty!");
            } else {
                num.value = ss;
                modalVisble.value = true;
            }
        }
    } catch (e) {
        console.error(`doi err = ${e}`)
    }
}

const vv = ref<string[]>([])
const num = ref<string[]>([])

const handleCancel = () => {
    vv.value = [];
    num.value = [];
    modalVisble.value = false;
};

onMounted(() => {
    if (props.data) {
        
    }
});

</script>

<template>
    <main>
        <a-table v-if="!props.isLink" :columns="columns" :data-source="data" :customRow="rowAction" :scroll="{ y: 360 }" :pagination="false"
            size="small" :bordered="true">
            <template #bodyCell="{ column, text }">

                <template v-if="column.dataIndex === 'img1'">
                    <!-- {{ text }} -->
                    <!-- <a-dropdown placement="bottom"> -->
                    <img :src="getUrl(text)" style="width:100%;" />

                    <!-- <template #overlay>
                            <a-menu @click="(e: any) => {
                                clickMenu(e.key, text);
                            }">
                                <a-menu-item key="0">
                                    查看
                                </a-menu-item>
                                <a-menu-item key="1">
                                    复制
                                </a-menu-item>
                                <a-menu-item key="2">
                                    DOI
                                </a-menu-item>
                                <a-menu-item key="3">
                                    PatentNumber
                                </a-menu-item>
                            </a-menu>
                        </template> -->
                    <!-- </a-dropdown> -->
                </template>
            </template>
        </a-table>
        <a-table v-else :columns="columns2" :data-source="data" :customRow="rowAction2" :scroll="{ y: 360 }" :pagination="false"
            size="small" :bordered="true">
            <template #bodyCell="{ column, text }">

                <template v-if="column.dataIndex === 'SMILES'">
                    <!-- {{ text }} -->
                    <!-- <a-dropdown placement="bottom"> -->
                    <img :src="getSmilesUrl(text)" style="width:100%;" />
                </template>
            </template>
        </a-table>
        <!-- <a-modal v-model:visible="modalVisble">
            <template #footer>
                <a-button key="submit" @click="handleCancel">Ok</a-button>
            </template>
            <div class="main3">
                <template v-if="num.length > 0" v-for="site in num">
                    {{ site }} {{ " " }}
                </template>

                <template v-else-if="vv.length > 0" v-for="site in vv">
                    <a :href="getDoiUrl(site)" target="_blank" class="marquee">{{ site }}</a>
                </template>

                <template v-else-if="modalVisble">
                    <img :src="modalImg" style="width:100%;" />
                </template>
            </div>
        </a-modal> -->
    </main>
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