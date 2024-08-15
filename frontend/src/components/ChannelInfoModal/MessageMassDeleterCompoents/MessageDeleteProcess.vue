<template>
  <div class="container mt-4">
    <div class="row">
      <span>訊息數 : {{ totalMessageCount }}</span>
    </div>
    <div class="row">
      <span>執行速度 : {{ speed }} ms</span>
    </div>
    <div class="py-1" style="border: 1px solid white; margin-top: 30px; padding-left: 10%; padding-right: 10%">
      <div class="row" style="margin-top: 10px">
        <div class="col">
          <span>取得訊息進度: {{ fetchProgressPercentage }}%</span>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="progress">
            <div
              class="progress-bar bg-info"
              role="progressbar"
              :style="{ width: fetchProgressPercentage + '%' }"
              :aria-valuenow="fetchProgressPercentage"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </div>
      <div class="row" style="margin-top: 10px">
        <div class="col">
          <span>刪除訊息進度: {{ deleteProgressPercentage }}%</span>
        </div>
      </div>
      <div class="row" style="margin-bottom: 15px">
        <div class="col">
          <div class="progress">
            <div
              class="progress-bar"
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
    <div class="row mb-4" style="margin-top: 15px">
      <div class="col">
        <h4 class="text-center">{{ systemMessage }}</h4>
      </div>
    </div>
    <div class="row">
      <div class="col text-center">
        <button v-if="!stop" class="btn btn-danger btn-lg" @click="stop = true">暫停</button>
        <button v-if="stop" class="btn btn-primary btn-lg" @click="continueProcess">繼續</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiscordChannel } from '@/api/guild/dto/read-channel'
import { getMemberByUserIdAndGuildIdApi, searchMessagesApi, deleteMessagesApi } from '@/api/guild/guild'
import type { APISearchMessage } from '@/common.class'
import { generateGuildIconUrl, generateUserAvatarUrl } from '@/functions/Discord'
import { useUserStore } from '@/stores/useUserStore'
import type { APIGuild, APIMessage } from 'discord-api-types/v10'
import { computed, onMounted, ref, type Ref } from 'vue'
import { wait } from '../../../functions/Common'
import Message from '../../MessageViewer/Message.vue'
import axios, { AxiosError, HttpStatusCode } from 'axios'

const systemMessage = ref('')
const userStore = useUserStore()
const authorName = ref('UNKNOW')
const authorIcon = ref('/unknow.jpg')
const messagesLeft = ref(0)
const deletedMessageCount = ref(0)
const totalMessageCount = ref(0)
const speed = ref(300)
const currentDeletingMessage: Ref<APIMessage | null> = ref(null)
let stop = ref(false)
const allMessages: Ref<APIMessage[][]> = ref([])

interface FilterSetting {
  authorId: string
  searchQuery: string
}

const props = defineProps<{ filterSetting: FilterSetting; guild: APIGuild; guildChannels: DiscordChannel[]; searchMessageResult: APISearchMessage }>()

onMounted(async () => {
  if (props.filterSetting.authorId) {
    if (userStore.user.discordUserId! === props.filterSetting.authorId) {
      authorName.value = userStore.user.discordUserData!.global_name!
      authorIcon.value = userStore.iconUrl
    } else {
      const result = await getMemberByUserIdAndGuildIdApi(props.guild.id, props.filterSetting.authorId)
      const member = result.data
      authorIcon.value = generateUserAvatarUrl(member?.user)
      if (member) {
        authorName.value = member.nick || member.user.global_name || member.user.username
      } else {
        authorName.value = 'UNKNOW'
      }
    }
  } else {
    authorName.value = 'ALL'
    authorIcon.value = generateGuildIconUrl(props.guild)
  }
  allMessages.value.push(...props.searchMessageResult.messages)
  messagesLeft.value = props.searchMessageResult.total_results
  totalMessageCount.value = props.searchMessageResult.total_results
  await getAllMessage()
  console.log(allMessages.value)
})

async function getAllMessage() {
  speed.value = 300
  let retryTimes = 0
  while (allMessages.value.length < messagesLeft.value && !stop.value) {
    try {
      systemMessage.value = `正在取得訊息... (${allMessages.value.length} / ${totalMessageCount.value})`
      const result = await searchMessagesApi(props.guild.id, props.filterSetting.searchQuery + `&offset=${allMessages.value.length}`)
      if (result.data) {
        allMessages.value.push(...result.data.messages)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError
        if (error.response?.status === HttpStatusCode.TooManyRequests) {
          retryTimes += 1
          if (speed.value < 1500) {
            speed.value += 100
          }
          let retryAfter = 10
          for (let i = retryAfter; i > 0; i--) {
            systemMessage.value = `請求過快, ${i}秒後再試`
            await wait(1000)
          }
        }
      }
    }
    await wait(speed.value)
  }
  if (stop.value) {
    systemMessage.value = '已暫停'
  } else {
    systemMessage.value = '已載入所有訊息!即將開始刪除訊息!'
  }
}

async function continueProcess() {
  stop.value = false
  if (allMessages.value.length < totalMessageCount.value) {
    await getAllMessage()
  }
}

const fetchProgressPercentage = computed(() => {
  return totalMessageCount.value > 0 ? ((allMessages.value.length / totalMessageCount.value) * 100).toFixed(1) : 0
})
const deleteProgressPercentage = computed(() => {
  return totalMessageCount.value > 0 ? ((deletedMessageCount.value / totalMessageCount.value) * 100).toFixed(1) : 0
})
</script>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

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

.success-message {
  color: #43b581;
  margin-bottom: 20px;
}

.stats {
  margin-bottom: 20px;
}

.deleted-count {
  color: #ff3860;
}

.remaining-count {
  color: #ffdd57;
}

.current-message-container {
  margin-bottom: 20px;
}

.button-container {
  text-align: center;
}

.stop-button {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
