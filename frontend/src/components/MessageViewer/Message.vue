<template>
  <div class="row">
    <div class="col-2" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
      <img class="rounded-circle" width="40px" height="40px" :src="generateUserAvatarUrl(message.author)" />
    </div>
    <div class="col" style="text-align: left; padding-top: 5px; padding-bottom: 5px">
      <div class="row">
        <span style="padding: 0px; margin-left: 10px; font-weight: bolder">{{ message.author.global_name }}</span>
      </div>
      <div class="row">
        <div v-html="parseMessageContent(message.content)"></div>
      </div>
      <div class="row" v-for="attachment of message.attachments">
        <img v-if="attachment.content_type === 'image/jpeg'" :src="attachment.url" />
      </div>
      <div class="row" v-for="sticker_item of message.sticker_items">
        <img :src="generateStickerUrl(sticker_item)" :alt="sticker_item.name" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { APIMessage } from 'discord-api-types/v10'
import { generateUserAvatarUrl, generateStickerUrl, generateEmojiUrl } from '../../functions/Discord'

const props = defineProps<{ message: APIMessage }>()

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
