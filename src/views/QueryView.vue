<script setup lang="ts">
import { onMounted, ref, createVNode } from "vue";
import { useRoute, useRouter } from "vue-router";
import { APISettings } from "../api/config";
import { message, Modal } from "ant-design-vue";

import { usePageStore } from "../stores/page";
import { DownloadOutlined, CloudDownloadOutlined } from "@ant-design/icons-vue";

const page = usePageStore();
page.setTitle("Query Search");

const route = useRoute();
const data = ref(undefined);

const query_text = ref<string>("");

const loading = ref(true);
const query_error = ref(false);
const cur_page = ref(1);
const page_size = ref(10);
const count = ref(0);
const res_error = ref("");

const gpt_visible = ref(false);
const gpt_question = ref<String>("");
const gpt_loading = ref<boolean>(false);
const router = useRouter();

let prev_query = "";

function getUrlAddress(pmid: string) {
  return `https://pubmed.ncbi.nlm.nih.gov/${pmid}`;
}

function getAuthor(first: string, last: string) {
  return `${first}，${last}`;
}

function getDoiUrl(doi: string) {
  return `https://sci-hub.se/${doi}`;
}

function getDoiUrl2(doi: string) {
  return `https://doi.org/${doi}`;
}

function setEllipsis(v: any) {
  // console.log('data = ', v)
  v.ellipsis = !v.ellipsis;
}

function downloadCsv() {
  Modal.confirm({
    title: "Click OK to start download up to 100 items",
    icon: createVNode(CloudDownloadOutlined),
    async onOk() {
      try {
        let res = await fetch(
          `${APISettings.baseURL}/api/pubmed/save/${encodeURIComponent(
            query_text.value
          )}?cur_page=0&page_size=100&file_type=csv`
        );

        if (res.status == 200) {
          let json = await res.json();
          if (json.ok) {
            let id = json.ok.id;
            let url = `${APISettings.baseURL}/download/csv/${id}`;
            console.log(`start download url = ${url}`);
            window.open(url, "_black");
          } else {
            message.error(`err:${json.error.msg}`);
          }
        }
        // console.log('data = ', JSON.stringify(data.value));
      } catch (e) {
        console.log("getdata error = ", e);
      }
    },
    onCancel() { },
  });
}

function search() {
  if (query_text.value == "") {
    message.info("please input query text!");
    return;
  } else if (query_text.value != prev_query) {
    router.replace(`/pubmed/${encodeURIComponent(query_text.value)}`);
    getData();
  }
}

async function getData() {
  loading.value = true;
  query_error.value = false;
  console.log(
    `getData : (page, pageSize) = (${cur_page.value}, ${page_size.value})`
  );

  try {
    let res = await fetch(
      `${APISettings.baseURL}/api/pubmed/${encodeURIComponent(
        query_text.value
      )}?cur_page=${cur_page.value - 1}&page_size=${page_size.value}`
    );

    if (res.status == 200) {
      loading.value = false;
      let json = await res.json();
      if (json.ok) {
        data.value = json.ok.data.map((item: object) => {
          return { ...item, ellipsis: true };
        });
        count.value = json.ok.count;
        prev_query = query_text.value;
      } else {
        res_error.value = json.error.msg;
      }
    }
  } catch (e) {
    console.log("getdata error = ", e);
    loading.value = false;
    query_error.value = true;
  }
}

async function getChatData() {
  console.log("getChatData...");

  if (gpt_question.value.length < 2) {
    message.info("please input quest first!");
    return;
  }

  gpt_loading.value = true;

  try {
    let formData = new FormData();
    formData.append("query", query_text.value);
    formData.append("question", gpt_question.value.toString());
    formData.append("page_size", import.meta.env.MODE === "development" ? "1" : "20");

    let res = await fetch(
      `${APISettings.baseURL}/api/openai/summary_with_query`,
      {
        body: formData,
        method: "post",
      }
    );

    if (res.status == 200) {
      gpt_visible.value = false;

      let json = await res.json();
      if (json.ok) {
        let id = json.ok.id;
        let url = `${APISettings.baseURL}/download/csv/${id}`;
        console.log(`start download url = ${url}`);
        window.open(url, "_black");
      } else {
        console.log(`summary error ${json.error.msg}`);

        message.warn(json.error.msg);
      }
    }
  } catch (e) {
    console.log("getChatData error = ", e);
  } finally {
    gpt_loading.value = false;
  }
}

function handleChat() {
  getChatData();
}

function handleChatCancel() {
  if (!gpt_loading.value) {
    gpt_visible.value = false;
  }
}

function showGptDialog() {
  gpt_visible.value = true;
}

onMounted(() => {
  console.log("query = ", route.params.term);
  query_text.value = route.params.term.toString();

  getData();
});

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
    <a-modal v-model:visible="gpt_visible" title="Auto GPT Question" :closable="false" :maskClosable="false">
      <a-textarea v-model:value="gpt_question" placeholder="eg: what is the relation between FXR and NLRP3" :rows="4"
        allowClear />
      <div v-if="gpt_loading" style="margin-top: 10px">
        <h3>Please wait patiently for 3-5 minutes!!</h3>
        <h3>DO NOT CLOSE THE PAGE!!</h3>
      </div>
      <template #footer>
        <a-button key="back" @click="handleChatCancel">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="gpt_loading" @click="handleChat">Submit</a-button>
      </template>
    </a-modal>
    <a-space>
      <div style="display: flex; flex-direction: row; min-width: none" class="content-style">
        <a-input style="flex: 1" v-model:value="query_text" placeholder="Enter a search term" @pressEnter="search"
          allowClear />
        <a-button type="primary" @click="search">Search</a-button>
      </div>

      <a-tooltip v-if="count > 0" placement="bottom">
        <template #title>Download up to 100 items</template>
        <a-button type="primary" shape="round" @click="downloadCsv">
          <template #icon>
            <DownloadOutlined />
          </template>
          CSV
        </a-button>
      </a-tooltip>

      <a-tooltip v-if="count > 0" placement="bottom">
        <template #title>Auto GPT up to 20 items</template>
        <a-button type="primary" shape="round" @click="showGptDialog">
          <template #icon>
            <DownloadOutlined />
          </template>
          GPT
        </a-button>
      </a-tooltip>
    </a-space>
  </div>

  <br />
  <div v-if="loading" style="margin: auto">
    <a-spin size="large" tip="Loading..." />
  </div>
  <div v-else-if="query_error" style="margin: auto">服务器出错,请重试!</div>
  <div v-else-if="res_error != ''" style="margin: auto">
    {{ res_error }}
  </div>
  <div v-else style="width: 66%">
    <a-pagination v-model:current="cur_page" v-model:pageSize="page_size" :total="count" @change="onPageChange" />
    <a-list :data-source="data">
      <template #renderItem="{ item, index }">
        <a-list-item>
          <a-row style="align-items: center; width: 100%">
            <a-col :span="1" style="font-size: 16px; color: #5b616b">
              {{ (cur_page - 1) * page_size + index + 1 }}
            </a-col>
            <a-col :span="23">
              <div class="list-item-div">
                <a :href="getUrlAddress(item.PMID)"> {{ item.Title }}</a>
                <div>{{ getAuthor(item.AuthorFirst, item.AuthorLast) }}</div>
                <div style="color: #4d8055">
                  <div class="list-item-div2">
                    <div>{{ item.EpubYear }}-</div>
                    <div>{{ item.EpubMonth }}</div>
                    <a-divider type="vertical" />
                    <div>ISSN: {{ item.ISSN }}</div>
                    <a-divider type="vertical" />

                    <div>doi: {{ item.DOI }}</div>
                    <a-divider type="vertical" />

                    <a :href="getDoiUrl(item.DOI)" target="_blank">sci-hub</a>
                    <a-divider type="vertical" />

                    <a :href="getDoiUrl2(item.DOI)" target="_blank">doi.org</a>
                  </div>
                  <div>PMID: {{ item.PMID }}</div>
                </div>

                <div v-if="item.ellipsis" class="lines" @click="setEllipsis(item)">
                  {{ item.Abstract }}
                </div>
                <div v-else @click="setEllipsis(item)">{{ item.Abstract }}</div>
              </div>
            </a-col>
          </a-row>
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

.list-item-div2 {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.background1 {
  display: flex;
  justify-content: center;
  background: #f0f0f0;
  width: 100%;
  padding: 1.5rem;
}

.list-item-div {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  text-align: left;
  font-size: 18px;
  line-height: 24px;
}
</style>
