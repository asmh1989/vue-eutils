<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import { DownOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { usePageStore } from "../stores/page";

const page = usePageStore();
page.setTitle("Query Builder");

const value = ref<string>("");
const value2 = ref("");
const start_date = ref("");
const if_disabled = ref(true);

const end_date = ref("");

const router = useRouter();

const current_search_index = ref(0);
const current_if_or_index = ref(0);

const search_content: Array<string> = [
  "All Fields",
  "Author",
  "Date - Publication",
  "Journal",
  "Publication Type",
  "Title",
  "Title/Abstract",
];

const if_or: Array<string> = ["Add with AND", "Add with OR", "Add with NOT"];

function getDaysInMonth(year: number, month: number) {
  const date = new Date(year, month, 1);
  date.setMonth(month + 1);
  date.setDate(0);
  return date.getDate();
}

function checkDate(dateValue: string) {
  let parts = dateValue.split("/");
  if (parts.length > 3) {
    return false;
  }
  if (parts.length == 1) {
    let year = parseInt(parts[0]);
    return year > 1970 && year < 3000;
  }
  if (parts.length == 2) {
    let year = parseInt(parts[0]);
    let mm = parseInt(parts[1]);
    return year > 1970 && year < 3000 && mm >= 1 && mm <= 12;
  }
  if (parts.length == 3) {
    let year = parseInt(parts[0]);
    let mm = parseInt(parts[1]);
    let dd = parseInt(parts[2]);
    let days = getDaysInMonth(year, mm - 1);

    return (
      year > 1970 && year < 3000 && mm >= 1 && mm <= 12 && dd >= 1 && dd <= days
    );
  }

  return false;
}

function queryTextChange() {
  let search = search_content[current_search_index.value];
  // console.log("queryTextChange ", search);

  let add_value = "";
  switch (search) {
    case "All Fields":
      add_value = value.value;
      break;
    case "Author":
      add_value = `${value.value}[Author]`;
      break;
    case "Date - Publication": {
      if (!checkDate(start_date.value)) {
        showDateWarning();
        start_date.value = "";
        return;
      }

      if (end_date.value != "" && !checkDate(end_date.value)) {
        showDateWarning();
        end_date.value = "";
        return;
      }

      let end_value = end_date.value == "" ? "3000" : end_date.value;
      add_value = `"${start_date.value}"[Date - Publication] : "${end_value}"[Date - Publication]`;
      break;
    }
    case "Journal":
      add_value = `"${value.value}"[Journal]`;
      break;
    case "Title":
      add_value = `${value.value}[Title]`;
      break;
    case "Title/Abstract":
      add_value = `${value.value}[Title/Abstract]`;
      break;
    case "Publication Type":
      add_value = `${value.value}[Publication Type]`;
      break;
    default:
      break;
  }

  if (value.value == "" && start_date.value == "") {
    return;
  }

  let if_text = getIfOrText();

  console.log("queryTextChange = ", add_value);

  if (value2.value == "") {
    value2.value = add_value;
  } else {
    value2.value = `(${value2.value}) ${if_text} (${add_value})`;
  }

  value.value = "";
  start_date.value = "";
  end_date.value = "";
}

function openQueryView() {
  if (value2.value != "") {
    router.push(`/pubmed/${encodeURIComponent(value2.value)}`);
  }
}

function format(val: string, preVal: string, value: Ref<string>) {
  const reg = /^[\d/]{1,}$/;

  // console.log("val = ", val, " preVal = ", preVal, reg.test(val))
  if (reg.test(val) || val == "") {
    value.value = val;
  } else {
    value.value = preVal;
  }
}

function showDateWarning() {
  message.info("Enter Dates as yyyy/mm/dd(month and day are optional)");
}

// 开始日期
watch(start_date, (val, preVal) => {
  format(val, preVal, start_date);
});

// 搜索框
watch(value2, (val) => {
  if_disabled.value = val == "";
  current_if_or_index.value = val == "" ? 0 : current_if_or_index.value;
});

watch(end_date, (val, preVal) => {
  format(val, preVal, end_date);
});

function getIfOrText() {
  // console.log("getIfOrText : ", state.current_if_or_index)
  switch (current_if_or_index.value) {
    case 0:
      return "AND";
    case 1:
      return "OR";
    default:
      return "NOT";
  }
}
function hasDate() {
  // console.log("has date", current_search_index.value, search_content[current_search_index.value]);
  return search_content[current_search_index.value].includes("Date");
}
</script>

<template>
  <div class="content-style">
    <h2 style="padding: 2rem 0">PubMed Advanced Search Builder</h2>

    <div>Add terms to the query box</div>
    <div class="search" style="padding: 0.5rem 0 2rem 0">
      <a-dropdown>
        <template #overlay>
          <a-menu @click="(e: any) => {
            current_search_index = e.key;
          }">
            <template v-for="(message, index) in search_content" :key="index">
              <a-menu-item>
                {{ message }}
              </a-menu-item>
            </template>
          </a-menu>
        </template>
        <a-button>
          {{ search_content[current_search_index] }}
          <DownOutlined />
        </a-button>
      </a-dropdown>

      <div class="flex-item" />
      <div class="input1" v-if="hasDate()">
        <a-input v-model:value="start_date" placeholder="YYYY/MM/DD" allowClear />
        <div style="padding: 0 0.5rem; display: flex; align-items: center">
          to
        </div>
        <a-input v-model:value="end_date" placeholder="Present" allowClear />
      </div>
      <div class="input1" v-else>
        <a-input v-model:value="value" placeholder="Enter a search term" allowClear />
      </div>
      <div class="flex-item" />

      <a-dropdown-button @click="queryTextChange">
        {{ getIfOrText() }}
        <template #overlay>
          <a-menu :disabled="if_disabled" @click="(e: any) => {
              current_if_or_index = e.key;

              if (value2 != '' && value != '') {
                queryTextChange();
              }
            }">
            <template v-for="(message, index) in if_or" :key="index">
              <a-menu-item>
                {{ message }}
              </a-menu-item>
            </template>
          </a-menu>
        </template>
        <template #icon>
          <DownOutlined />
        </template>
      </a-dropdown-button>
    </div>
    <div>Query box</div>
    <div class="search" style="padding: 0.5rem 0 2rem 0">
      <a-textarea v-model:value="value2" placeholder="Enter / edit your search query here" :rows="3" allowClear />
      <div class="flex-item" />
      <a-button type="primary" @click="openQueryView">Search</a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.search {
  display: flex;
  flex-direction: row;
  width: 100%;
  // color: white;
}

.input1 {
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
}

.flex-item {
  margin: 0 5px;
  /* 设置每个 item 的左右间隔为 10px */
}
</style>
