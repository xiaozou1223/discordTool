<template>
  <div class="container mt-4">
    <div class="row" style="margin-top: 5px; margin-bottom: 5px">
      <div class="col">
        <!-- 控制按鈕 -->
        <button v-if="!messageDeleteProcessStore.isStopping && !messageDeleteProcessStore.isFinished" class="btn btn-warning" @click="stopProcess">
          暫停
        </button>
        <button v-if="messageDeleteProcessStore.isStopping && !messageDeleteProcessStore.isFinished" class="btn btn-primary" @click="continueProcess">
          繼續
        </button>
        <button
          v-if="messageDeleteProcessStore.isStopping && !messageDeleteProcessStore.isFinished"
          class="btn btn-danger"
          @click="breakProcess"
          style="margin-left: 5px"
        >
          中止
        </button>
        <button v-if="messageDeleteProcessStore.isFinished" class="btn btn-warning" @click="backToFilterPage">返回</button>
        <button
          v-if="messageDeleteProcessStore.isFinished && deletedMessages.length > 0"
          class="btn btn-info"
          @click="downloadDeletedMessages"
          style="margin-left: 5px"
        >
          下載
        </button>
      </div>
    </div>

    <!--統計-->
    <div class="row">
      <span>訊息數 : {{ totalMessageCount }}</span>
    </div>
    <div class="row">
      <span>已刪除 : {{ deletedMessages.length }}</span>
    </div>
    <div class="row" v-if="!messageDeleteProcessStore.isFinished && !messageDeleteProcessStore.isStopping">
      <span>執行速度 : {{ speed }} ms</span>
    </div>

    <!-- 進度條 -->
    <div style="margin-top: 5px; padding-left: 10%; padding-right: 10%">
      <div v-if="!messageDeleteProcessStore.isMessageLoaded" class="row">
        <div class="col">
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              :style="{ width: fetchProgressPercentage + '%' }"
              :aria-valuenow="fetchProgressPercentage"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </div>
      <div v-else class="row" style="margin-bottom: 15px">
        <div class="col">
          <div class="progress">
            <div
              class="progress-bar-delete"
              role="progressbar"
              :style="{ width: deleteProgressPercentage + '%' }"
              :aria-valuenow="deleteProgressPercentage"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 系統訊息 -->
    <div class="row" style="margin-top: 5px">
      <span style="font-size: 18px; color: burlywood">{{ systemMessage }}</span>
    </div>

    <!-- 正在刪除的訊息 -->
    <div v-if="!messageDeleteProcessStore.isFinished && currentDeletingMessage" class="message-viewer">
      <Message :guild="guild" :message="currentDeletingMessage" :key="currentDeletingMessage.id" />
    </div>

    <!-- 已刪除的訊息 -->
    <div v-if="messageDeleteProcessStore.isFinished && deletedMessages.length > 0" class="message-viewer">
      <Message v-for="deletedMessage of reversedDeletedMessages" :guild="guild" :message="deletedMessage" :key="deletedMessage.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface FilterSetting {
  authorId: string
  searchQuery: string
}

import type { DiscordChannel } from '@/api/guild/dto/read-channel'
import { searchMessagesApi, deleteMessagesApi } from '@/api/guild/guild'
import type { APISearchMessage } from '@/common.class'
import type { APIChannel, APIGuild, APIMessage } from 'discord-api-types/v10'
import { computed, onMounted, ref, toRaw, type Ref } from 'vue'
import { wait } from '../../../functions/Common'
import Message from '../../MessageViewer/Message.vue'
import axios, { AxiosError, HttpStatusCode } from 'axios'
import moment from 'moment'
import { useMessageDeleteProcessStore } from '../../../stores/useMessageDeleteProcessStore'

const emit = defineEmits<{
  (e: 'backToFilterPage'): void
}>()

const props = defineProps<{
  filterSetting: FilterSetting
  guild: APIGuild
  guildChannels: DiscordChannel[]
  channel: APIChannel
  searchMessageResult: APISearchMessage
}>()

const systemMessage = ref('')
const totalMessageCount = ref(0)
const speed = ref(300)
const currentDeletingMessage: Ref<APIMessage | null> = ref(null)
const allMessages: Ref<APIMessage[]> = ref([])
const deletedMessages: Ref<APIMessage[]> = ref([])

const MAX_WAIT_TIME = 1500
const DEFAULT_SEARCH_SPEED = 300
const DEFAULT_DELETED_SPEED = 50

const messageDeleteProcessStore = useMessageDeleteProcessStore(props.channel.id)

onMounted(async () => {
  allMessages.value.push(
    ...props.searchMessageResult.messages.map((messageArray) => {
      return messageArray[0]
    }),
  )
  totalMessageCount.value = props.searchMessageResult.total_results
  await startProcess()
})

async function loadAllMessage() {
  speed.value = DEFAULT_SEARCH_SPEED
  while (allMessages.value.length < totalMessageCount.value && !messageDeleteProcessStore.isFinished) {
    try {
      systemMessage.value = `載入訊息... ( ${allMessages.value.length} / ${totalMessageCount.value} )`
      const result = await searchMessagesApi(props.guild.id, props.filterSetting.searchQuery + `&offset=${allMessages.value.length}`)
      if (result.data) {
        allMessages.value.push(
          ...result.data.messages.map((messageArray) => {
            return messageArray[0]
          }),
        )
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError
        if (error.response?.status === HttpStatusCode.TooManyRequests) {
          await handleRateLimit(10)
        }
      }
    }
    await waitForResume()
    await wait(speed.value)
  }
  messageDeleteProcessStore.isMessageLoaded = true
}

async function deleteMessages() {
  speed.value = DEFAULT_DELETED_SPEED
  for (let index = deletedMessages.value.length; index < allMessages.value.length; index++) {
    while (!messageDeleteProcessStore.isFinished) {
      try {
        const message = allMessages.value[index]
        currentDeletingMessage.value = message
        systemMessage.value = `刪除訊息... ( ${deletedMessages.value.length + 1} / ${totalMessageCount.value} )`
        await deleteMessagesApi(message.channel_id, message.id)
        deletedMessages.value.push(message)
        break
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const error = err as AxiosError
          if (error.response?.status === HttpStatusCode.TooManyRequests) {
            await handleRateLimit(10)
          }
        }
      }
      await waitForResume()
    }
    await waitForResume()
    await wait(speed.value)
  }
}

async function waitForResume() {
  let dotCount = 0
  const baseMessage = '已暫停'
  while (messageDeleteProcessStore.isStopping && !messageDeleteProcessStore.isFinished) {
    systemMessage.value = `${baseMessage}${'.'.repeat(dotCount % 4)}`
    dotCount++
    await wait(500)
  }
}

async function handleRateLimit(retryAfter: number) {
  if (speed.value < MAX_WAIT_TIME) {
    speed.value += 100
  }
  for (let i = retryAfter; i > 0 && !messageDeleteProcessStore.isStopping; i--) {
    systemMessage.value = `請求過快, ${i}秒後再試`
    await wait(1000)
  }
}

async function startProcess() {
  messageDeleteProcessStore.isStopping = false
  if (allMessages.value.length < totalMessageCount.value) {
    await loadAllMessage()
  }
  systemMessage.value = '即將開始刪除訊息'
  await wait(3000)
  if (allMessages.value.length >= totalMessageCount.value) {
    await deleteMessages()
  }
  if (deletedMessages.value.length === allMessages.value.length) {
    systemMessage.value = '已完成批量刪除'
    currentDeletingMessage.value = null
    messageDeleteProcessStore.isFinished = true
    downloadDeletedMessages()
  }
}

async function stopProcess() {
  messageDeleteProcessStore.isStopping = true
}

async function continueProcess() {
  messageDeleteProcessStore.isStopping = false
}

function breakProcess() {
  const ok = confirm('確認要中止嗎')
  if (!ok) {
    return
  }
  messageDeleteProcessStore.isStopping = true
  messageDeleteProcessStore.isFinished = true
  systemMessage.value = '已中斷'
  if (deletedMessages.value.length > 0) {
    downloadDeletedMessages()
  }
}

function backToFilterPage() {
  if (deletedMessages.value.length > 0) {
    const ok = confirm('確定要返回嗎，返回後無法再次下載紀錄')
    if (!ok) {
      return
    }
  }
  emit('backToFilterPage')
}

function downloadDeletedMessages() {
  const jsonString = JSON.stringify(toRaw(deletedMessages.value).reverse(), null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const now = moment().format('YYYY_MM_DD_HH_mm')
  const filename = `${props.guild.name}_${props.channel.name}_${now}_deleted_message.json`
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const fetchProgressPercentage = computed(() => {
  return totalMessageCount.value > 0 ? ((allMessages.value.length / totalMessageCount.value) * 100).toFixed(1) : 0
})
const deleteProgressPercentage = computed(() => {
  return totalMessageCount.value > 0 ? ((deletedMessages.value.length / totalMessageCount.value) * 100).toFixed(1) : 0
})
const reversedDeletedMessages = computed(() => {
  return [...deletedMessages.value].reverse()
})
</script>

<style scoped>
.progress-container {
  flex-grow: 1;
  height: 20px;
  background-color: #4f545c;
  border-radius: 10px;
  margin-left: 20px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #7289da;
  transition: width 0.3s ease;
}

.progress-bar-delete {
  height: 100%;
  background-color: #ee2b45;
  transition: width 0.3s ease;
}

.current-message-container {
  margin-bottom: 20px;
}

.button-container {
  text-align: center;
}

.message-viewer {
  border: 1px solid white;
  min-height: 30%;
  margin-top: 10px;
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
