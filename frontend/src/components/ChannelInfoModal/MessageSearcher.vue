<template>
  <div>
    <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
      <div class="col-1" style="text-align: center; padding-top: 28px; padding-bottom: 28px; font-weight: bolder">
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
          <span style="padding: 0px; margin-left: 10px; font-weight: bolder">已搜尋到{{ searchMessageResult.total_results }}則訊息</span>
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
          <div class="row" v-for="message of searchMessageResult?.messages">
            <div class="col-2" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
              <img class="rounded-circle" width="40px" height="40px" :src="generateUserAvatarUrl(message[0].author)" />
            </div>
            <div class="col" style="text-align: left; padding-top: 5px; padding-bottom: 5px">
              <div class="row">
                <span style="padding: 0px; margin-left: 10px; font-weight: bolder">{{ message[0].author.global_name }}</span>
              </div>
              <div class="row">
                <div v-html="parseMessageContent(message[0].content)"></div>
              </div>
              <div class="row" v-for="attachment of message[0].attachments">
                <img v-if="attachment.content_type === 'image/jpeg'" :src="attachment.url" />
              </div>
              <div class="row" v-for="sticker_item of message[0].sticker_items">
                <img :src="generateStickerUrl(sticker_item)" :alt="sticker_item.name" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
      <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px; font-weight: bolder">
        <button @click="emit('backToFilterPage')" class="btn btn-primary">返回</button>
      </div>
      <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px; font-weight: bolder">
        <button @click="emit('backToFilterPage')" class="btn btn-danger">批量刪除</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../../stores/useUserStore'
import { getMemberByUserIdAndGuildIdApi, searchMessagesApi } from '@/api/guild/guild'
import type { APISearchMessage } from '@/common.class'
import type { APIGuild, APIGuildMember, APIMessage, APIMessageComponent } from 'discord-api-types/v10'
import { ref, type Ref, onMounted, watch, computed } from 'vue'
import { generateUserAvatarUrl, generateGuildIconUrl, generateStickerUrl, generateEmojiUrl } from '../../functions/Discord'

interface FilterSetting {
  authorId: string
  searchQuery: string
}

const userStore = useUserStore()
const authorName = ref('UNKNOW')
const authorIcon = ref('/unknow.jpg')
const searchMessageResult: Ref<APISearchMessage | null> = ref(null)

const props = defineProps<{ filterSetting: FilterSetting; guild: APIGuild }>()
const emit = defineEmits<{
  (e: 'backToFilterPage'): void
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
    searchMessageResult.value.messages.reverse()
    console.log(searchMessageResult.value)
  }
})

function parseMessageContent(content: string) {
  const emojiRegex = /<:[a-zA-Z0-9_]+:[0-9]+>/g

  const formattedContent = content.replace(emojiRegex, (match) => {
    const [_, emojiName, emojiId] = match.match(/^<:([a-zA-Z0-9_]+):([0-9]+)>$/)!
    const emojiUrl = generateEmojiUrl(emojiId)
    return `<img src="${emojiUrl}" alt="${emojiName}" class="emoji">`
  })

  return formattedContent.replace(/(^|>)([^<]+)(<|$)/g, '$1<span>$2</span>$3')
}
</script>

<style>
.emoji {
  width: 30px;
  height: 30px;
  vertical-align: middle;
}
.sticker {
  width: 100px;
  height: 100px;
  vertical-align: middle;
}
</style>
