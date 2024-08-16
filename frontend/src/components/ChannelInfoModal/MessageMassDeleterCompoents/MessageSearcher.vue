<template>
  <div>
    <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
      <div class="col-2" style="text-align: center; padding-top: 28px; padding-bottom: 28px; font-weight: bolder">
        <span style="padding: 0px; margin-left: 10px; font-weight: bolder">從</span>
      </div>
      <div class="col-3" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
        <img class="rounded-circle" width="65px" height="65px" :src="authorIcon" />
      </div>
      <div class="col" style="text-align: left; padding-top: 28px; padding-bottom: 28px">
        <span style="padding: 0px; margin-left: 10px; font-weight: bolder">{{ authorName }}</span>
      </div>
    </div>
    <div v-if="searchMessageResult">
      <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
        <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px; font-weight: bolder">
          <span style="padding: 0px; margin-left: 10px; font-weight: bolder"
            >已搜尋到{{ searchMessageResult.messages.length === 0 ? 0 : searchMessageResult.total_results }}則訊息</span
          >
        </div>
      </div>
      <div
        class="row clickable-item"
        style="margin-right: 0px; margin-left: 0px; margin-top: 10px; background-color: #3c3c3c"
        data-bs-toggle="collapse"
        data-bs-target="#message-viewer"
      >
        <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px; font-weight: bolder">
          <span style="padding: 0px; margin-left: 10px; font-weight: bolder" @click="messagesViewer!.scrollTop = messagesViewer!.scrollHeight"
            >訊息預覽(最多顯示25則)</span
          >
        </div>
      </div>
      <div class="row collapse" id="message-viewer" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
        <div class="container" style="max-height: 300px; overflow-y: auto; overflow-x: hidden; border: 1px solid #ccc" ref="messagesViewer">
          <Message v-for="message of reversedResultMessage" :message="message[0]" :guildChannels="guildChannels" :guild="guild" />
        </div>
      </div>
    </div>
    <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
      <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px; font-weight: bolder">
        <button @click="emit('backToFilterPage')" class="btn btn-primary">返回</button>
      </div>
      <div v-if="searchMessageResult" class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px; font-weight: bolder">
        <button
          @click="deleteMessage"
          class="btn btn-danger"
          :disabled="searchMessageResult.total_results <= 0 || searchMessageResult.messages.length === 0"
        >
          刪除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../../../stores/useUserStore'
import { getMemberByUserIdAndGuildIdApi, searchMessagesApi } from '@/api/guild/guild'
import type { APISearchMessage } from '@/common.class'
import type { APIGuild } from 'discord-api-types/v10'
import { ref, type Ref, onMounted, computed } from 'vue'
import { generateUserAvatarUrl, generateGuildIconUrl } from '../../../functions/Discord'
import Message from '../../MessageViewer/Message.vue'
import type { DiscordChannel } from '@/api/guild/dto/read-channel'

interface FilterSetting {
  authorId: string
  searchQuery: string
}

const userStore = useUserStore()
const authorName = ref('UNKNOW')
const authorIcon = ref('/unknow.jpg')
const searchMessageResult: Ref<APISearchMessage | null> = ref(null)

const props = defineProps<{ filterSetting: FilterSetting; guild: APIGuild; guildChannels: DiscordChannel[] }>()
const emit = defineEmits<{
  (e: 'backToFilterPage'): void
  (e: 'startDelete', searchMessageResult: APISearchMessage): void
}>()
const messagesViewer = ref<HTMLElement | null>(null)

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
  console.log(props.filterSetting.searchQuery)
  const result = await searchMessagesApi(props.guild.id, props.filterSetting.searchQuery)
  console.log('searchMessage!')
  if (result.data) {
    searchMessageResult.value = result.data
    console.log(searchMessageResult.value)
  }
})

function deleteMessage() {
  const ok = confirm(`確定要刪除${searchMessageResult.value?.total_results}則訊息嗎?\n此動作不可逆`)
  if (!ok || !searchMessageResult.value) {
    return
  }
  emit('startDelete', searchMessageResult.value)
}

const reversedResultMessage = computed(() => {
  if (searchMessageResult.value) {
    return [...searchMessageResult.value.messages].reverse()
  }
})
</script>
