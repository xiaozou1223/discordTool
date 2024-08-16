import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMessageDeleteProcessStore = (id: string) => {
  return defineStore(`messageDeleteProcess-${id}`, () => {
    const isMessageLoaded = ref(false)
    const isStopping = ref(false)
    const isFinished = ref(false)
    const isRunning = ref(false)

    return {
      isMessageLoaded,
      isStopping,
      isFinished,
      isRunning,
    }
  })()
}
