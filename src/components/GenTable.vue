<script setup lang="ts">
import { APISettings } from '@/api/config';
import { getDoiUrl, copyToClipboard, type TableGenDataType } from '@/common/mode';

import { message, type TableColumnType, type TableProps } from 'ant-design-vue';
import { onBeforeUpdate, ref } from 'vue';


let columns: TableColumnType<TableGenDataType>[] = [
    {
        title: 'struct',
        dataIndex: 'SMILES',
        key: 'smiles',
        width: 220,
        fixed: 'left'
    },
    {
        title: 'left_struct',
        dataIndex: 'Left_Frag',
        width: 220,
    },
    {
        title: 'right_struct',
        dataIndex: 'Right_Frag',
        key: 'smiles',
        width: 220,
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
        width: 100

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
        width: 100

    },
    {
        title: 'right_std',
        dataIndex: 'Right_std',
        sorter: (a: TableGenDataType, b: TableGenDataType) => a.Right_std - b.Right_std,
        sortDirections: ['descend', 'ascend'],
    },
    // {
    //     title: 'left_ref',
    //     dataIndex: 'Left_ArticleDOI',
    //     width: 120
    // },
    // {
    //     title: 'right_ref',
    //     dataIndex: 'Right_ArticleDOI',
    //     width: 120
    // },

];

let columns2: TableColumnType<TableGenDataType>[] = [
    {
        title: 'struct',
        dataIndex: 'SMILES',
        key: 'smiles',
        width: 240,
        fixed: 'left'
    },
    {
        title: 'JAK1ToJAK2_mean',
        dataIndex: 'JAK1ToJAK2_mean',
        sorter: (a: TableGenDataType, b: TableGenDataType) => a.JAK1ToJAK2_mean! - b.JAK1ToJAK2_mean!,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'JAK1ToJAK2_median',
        dataIndex: 'JAK1ToJAK2_std',
        sorter: (a: TableGenDataType, b: TableGenDataType) => a.JAK1ToJAK2_median! - b.JAK1ToJAK2_median!,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'JAK1ToJAK2_std',
        dataIndex: 'JAK1ToJAK2_median',
        sorter: (a: TableGenDataType, b: TableGenDataType) => a.JAK1ToJAK2_std! - b.JAK1ToJAK2_std!,
        sortDirections: ['descend', 'ascend'],
    }
];

const jak1Tojak2 = ref(false);

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
            try {
                if (title.startsWith('left')) {
                    f.title = title.replace("left", nn[0].toLocaleLowerCase());
                } else if (title.startsWith('right')) {
                    f.title = title.replace("right", nn[1].toLocaleLowerCase());
                }
            } catch (e) {

            }
        })

        if (props.data.length > 0) {
            let n = props.data[0];
            if (n.JAK1ToJAK2_mean) {
                jak1Tojak2.value = true;
            } else {
                jak1Tojak2.value = false;
            }
        } else {
            jak1Tojak2.value = false;

        }

    }
});
const modalVisble = ref(false);
const modalImg = ref('');

function getUrl(url: string) {
    let data = props.data.find((person => person.SMILES === url));
    return `${APISettings.baseURL}/dual/${props.target}/GenCPDs/Struct/${encodeURIComponent(data!.title)}.png`
}

function getUrl2(url: string, left: boolean) {
    let nn = props.target.split('-');
    let n = nn[0];
    if (!left) {
        n = nn[1];
    }
    return `${APISettings.baseURL}/dual/${props.target}/${n}/Motifs-R/Smi_${encodeURIComponent(url)}.png`
}

function getUrl3(url: string, left: boolean) {
    let nn = props.target.split('-');
    let n = nn[0];
    if (!left) {
        n = nn[1];
    }
    return `${APISettings.baseURL}/dual/${props.target}/${n}/Motifs-R/Smi_${encodeURIComponent(url)}_dist.png`
}



function clickMenu(key: number, text: string) {
    // let data = props.data.find((person => person.img1 === text));
    // console.log(`clickMenu key = ${key}, data = ${JSON.stringify(data)}`);

    if (key == 0) {
        // modalImg.value = getUrl(data!.img2);
        // modalVisble.value = true;
    } else if (key == 1) {
        copyToClipboard(text);

    }
}

function clickMenu1(key: number, text: any, index: string, left: boolean) {
    let data = props.data.find(person => (person as any)[index] == text);
    // console.log(`clickMenu key = ${key}, data = ${JSON.stringify(data)}`);
    vv.value = [];
    num.value = [];

    try {
        let pp = data!;
        let t = pp.Left_ArticleDOI.replace(/'/g, '"');
        let s = pp.Left_PatentNumber.replace(/'/g, '"');
        if (left) {
            t = pp.Left_ArticleDOI.replace(/'/g, '"');
        } else {
            t = pp.Right_ArticleDOI.replace(/'/g, '"');

            s = pp.Right_PatentNumber.replace(/'/g, '"');
        }


        if (key == 0) {
            modalImg.value = getUrl3((data as any)[index], left);
            modalVisble.value = true;
        } else if (key == 1) {
            copyToClipboard(text);
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

const handleCancel = () => {
    vv.value = [];
    num.value = [];
    modalVisble.value = false;

};

const vv = ref<string[]>([])
const num = ref<string[]>([])

</script>

<template>
    <main>
        <a-table :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 480 }" :pagination="false" :bordered="true"
            size="small">
            <template #bodyCell="{ column, text, record }">

                <template v-if="column.dataIndex === 'SMILES'">
                    <a-dropdown placement="bottom">
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
                    <a-dropdown placement="bottom">
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
                                <a-menu-item key="2">
                                    DOI
                                </a-menu-item>
                                <a-menu-item key="3">
                                    PatentNumber
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </template>

                <template v-if="column.dataIndex === 'Right_Frag'">
                    <a-dropdown placement="bottom">
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
                                <a-menu-item key="2">
                                    DOI
                                </a-menu-item>
                                <a-menu-item key="3">
                                    PatentNumber
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </template>
                <!-- 
                <template v-if="column.dataIndex === 'Right_ArticleDOI'">
                    <Doi :text="record" :dataIndex="column.dataIndex" />
                </template>
                <template v-if="column.dataIndex === 'Left_ArticleDOI'">
                    <Doi :text="record" :dataIndex="column.dataIndex" />
                </template> -->
            </template>



        </a-table>


        <div v-if="jak1Tojak2" class="main1">
            Extra:
            <a-table :columns="columns2" :data-source="data" :pagination="false" :bordered="true" size="small"
                :scroll="{ y: 480 }">
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
                </template>
            </a-table>
        </div>
        <a-modal v-model:visible="modalVisble">
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
        </a-modal>
    </main>
</template>

<style>
.main1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 将子元素垂直居中 */
    justify-content: center;
    gap: 0.4rem;
    margin: auto;
    width: 60%;
    /* 将子元素水平居中 */
}

.main3 {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 将子元素垂直居中 */
    justify-content: center;
    /* 将子元素水平居中 */
}
</style>