<script setup lang="ts">
import { getDoiUrl, getUrl, type TableDataType } from "@/common/mode";
import { message } from "ant-design-vue";
import { onBeforeUpdate, onMounted, ref } from "vue";

interface Props {
  data: TableDataType;
}

const props = defineProps<Props>();

onBeforeUpdate(() => {});

onMounted(() => {
  try {
  } catch (e) {
    console.error(`doi err = ${e}`);
  }
});

const modalVisble = ref(false);
const modalImg = ref("");

const vv = ref<string[]>([]);
const num = ref<string[]>([]);

const handleCancel = () => {
  vv.value = [];
  num.value = [];
  modalVisble.value = false;
};

function clickMenu(key: number) {
  vv.value = [];
  num.value = [];
  try {
    let pp = props.data;
    let t = pp.ArticleDOI.replace(/'/g, '"');
    let s = pp.PatentNumber.replace(/'/g, '"');
    if (key == 2) {
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
    message.info("empty!");
    console.error(`doi err = ${e}`);
  }
}
</script>

<template>
  <div class="main3" style="height: 100%">
    <div class="main3">
      <a-space direction="vertical">
        <div>{{ data.SMILES }}</div>
        <!-- <a-divider /> -->
        <a-image
          style="max-height: 300px"
          :src="getUrl(data!.img2)"
          :preview="false"
        />
        <a-row>
          <a-col :span="12">
            <a-button
              @click="(e: any) => {
                        clickMenu(2);
                    }"
            >
              DOI
            </a-button>
          </a-col>
          <a-col :span="12"
            ><a-button
              @click="
                () => {
                  clickMenu(3);
                }
              "
              >PatentNumber</a-button
            ></a-col
          >
        </a-row>
      </a-space>
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
          <a :href="getDoiUrl(site)" target="_blank" class="marquee">{{
            site
          }}</a>
        </template>

        <template v-else-if="modalVisble">
          <img :src="modalImg" style="width: 100%" />
        </template>
      </div>
    </a-modal>
  </div>
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
