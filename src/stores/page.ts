import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePageStore = defineStore('page', () => {
    const title = ref('')
    function setTitle(t: string) {
        title.value = t;
    }

    return { title, setTitle }
})
