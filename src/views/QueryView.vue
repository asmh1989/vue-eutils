<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { APISettings } from '../api/config'
import { message } from 'ant-design-vue';

import { usePageStore } from '../stores/page'

const page = usePageStore();
page.setTitle('Query Search')

const route = useRoute();
const router = useRouter();
const data = ref(undefined)

const query_text = ref<string>('');

const loading = ref(true);
const query_error = ref(false);
const cur_page = ref(1);
const page_size = ref(10);
const count = ref(0);
const res_error = ref('');
let prev_query = '';

function getUrlAddress(pmid: string) {
    return `https://pubmed.ncbi.nlm.nih.gov/${pmid}`
}

function getAuthor(first: string, last: string) {
    return `${first}，${last}`;
}

function getDoiUrl(doi: string) {
    return `https://sci-hub.se/${doi}`
}

function getDoiUrl2(doi: string) {
    return `https://doi.org/${doi}`
}

function setEllipsis(v: any) {
    // console.log('data = ', v)
    v.ellipsis = !v.ellipsis;
}

function search() {
    if (query_text.value == '') {
        message.info('please input query text!');
        return;
    }
    else if (query_text.value != prev_query) {
        getData();
    }
}

async function getData() {
    loading.value = true;
    query_error.value = false;
    console.log(`getData : (page, pageSize) = (${cur_page.value}, ${page_size.value})`)


    try {
        let res = await fetch(`${APISettings.baseURL}/api/pubmed/${encodeURIComponent(query_text.value)}?cur_page=${cur_page.value - 1}&page_size=${page_size.value}`);

        if (res.status == 200) {
            loading.value = false;
            let json = await res.json();
            if (json.ok) {
                data.value = json.ok.data.map((item: object) => {
                    return { ...item, ellipsis: true }
                });
                data.value
                // cur_page.value = json.ok.cur_page + 1;
                count.value = json.ok.count;
                // page_size.value = json.page_size;
                prev_query = query_text.value;
            } else {
                res_error.value = json.error.msg;
            }
        }

        // console.log('data = ', JSON.stringify(data.value));

    } catch (e) {
        console.log("getdata error = ", e);
        loading.value = false;
        query_error.value = true;
    }
}

onMounted(() => {
    console.log("query = ", route.params.term);
    query_text.value = route.params.term.toString();

    getData();

})

function onPageChange(page: number, pageSize: number) {
    cur_page.value = page;
    page_size.value = pageSize;
    // console.log(`(page, pageSize) = (${cur_page.value}, ${page_size.value})`)

    getData();

}


</script>
  

<template>
    <!-- // header -->
    <div class="background1">
        <div style="display: flex; flex-direction: row; min-width: none; " class="content-style">
            <a-input style="flex: 1;" v-model:value="query_text" placeholder="Enter a search term" @pressEnter="search"
                allowClear />
            <a-button type="primary" @click="search">Search</a-button>
        </div>
    </div>
    <p />
    <div v-if="loading" style="margin: auto;">
        <a-spin size="large" tip="Loading..." />
    </div>
    <div v-else-if="query_error" style="margin: auto;">
        服务器出错,请重试!
    </div>
    <div v-else-if="res_error != ''" style="margin: auto;">
        {{ res_error }}
    </div>
    <div v-else style="width: 66%;">
        <a-pagination v-model:current="cur_page" v-model:pageSize="page_size" :total="count" @change="onPageChange" />
        <a-list :data-source="data">
            <template #renderItem="{ item, index }">
                <a-list-item>
                    <div style="display: flex; flex-direction: row;align-items: center;">
                        <div style="font-size: 16px; padding: 1rem; color: #5b616b;">{{ (cur_page - 1) * page_size + index +
                            1 }}
                        </div>
                        <div class="list-item-div">
                            <a :href=getUrlAddress(item.PMID)> {{ item.Title }}</a>
                            <div> {{ getAuthor(item.AuthorFirst, item.AuthorLast) }} </div>
                            <div style="color: #4D8055;">
                                <div
                                    style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center;">
                                    <div>{{ item.EpubYear }}- </div>
                                    <div>{{ item.EpubMonth }}</div>
                                    <a-divider type="vertical" />
                                    <div>ISSN: {{ item.ISSN }}</div>
                                    <a-divider type="vertical" />

                                    <div>doi: {{ item.DOI }}

                                    </div>
                                    <a-divider type="vertical" />

                                    <a :href=getDoiUrl(item.DOI) target="_blank">sci-hub</a>
                                    <a-divider type="vertical" />

                                    <a :href=getDoiUrl2(item.DOI) target="_blank">doi.org</a>
                                </div>
                                <div> PMID: {{ item.PMID }} </div>
                            </div>

                            <div v-if="item.ellipsis" class="lines" @click="setEllipsis(item)">{{ item.Abstract }}
                            </div>
                            <div v-else @click="setEllipsis(item)">{{ item.Abstract }}</div>

                        </div>
                    </div>

                </a-list-item>
            </template>
        </a-list>
    </div>
</template>

<style>
.lines {
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
</style>