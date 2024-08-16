<template>
  <div class="row message-row">
    <!-- Avatar Section -->
    <div class="col-auto avatar-col">
      <img class="rounded-circle avatar" :src="generateUserAvatarUrl(message.author)" />
    </div>

    <!-- Message Content Section -->
    <div class="col message-content-col">
      <!-- Username -->
      <div style="text-align: left">
        <span class="username">{{ message.author.global_name }}</span>
        <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
      </div>

      <!-- Message Content -->
      <div class="message-content">
        <div v-html="messageContentHtml"></div>
      </div>

      <!-- Attachments -->
      <div v-if="message.attachments" class="attachments">
        <div v-for="attachment of message.attachments" :key="attachment.id" v-html="generateAttachmentHtml(attachment)" class="attachment-item"></div>
      </div>

      <!-- Stickers -->
      <div v-if="message.sticker_items" class="stickers">
        <img
          v-for="sticker_item of message.sticker_items"
          :key="sticker_item.id"
          :src="generateStickerUrl(sticker_item)"
          :alt="sticker_item.name"
          class="sticker-item"
        />
      </div>
      <!-- Embeds -->
      <div v-if="message.embeds.length > 0" class="embeds">
        <div v-for="embed of message.embeds" v-html="generateEmbedHtml(embed)"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { APIAttachment, APIEmbed, APIGuild, APIMessage } from 'discord-api-types/v10'
import { generateUserAvatarUrl, generateStickerUrl, generateEmojiUrl } from '../../functions/Discord'
import { onMounted, ref, type Ref } from 'vue'
import moment from 'moment'

const messageContentHtml: Ref<string> = ref('')
const props = defineProps<{ message: APIMessage; guild: APIGuild }>()

onMounted(async () => {
  messageContentHtml.value = await generateMessageContentHtml(props.message.content)
})

async function generateMessageContentHtml(content: string) {
  props.message.mention_channels
  const emojiRegex = /<a?:([a-zA-Z0-9_]+):([0-9]+)>/g
  const userMentionRegex = /<@!?(\d+)>/g
  const channelMentionRegex = /<#(\d+)>/g
  const roleMentionRegex = /<@&(\d+)>/g
  const promises: Promise<string>[] = []

  let formattedContent = content.replace(emojiRegex, (match, emojiName, emojiId) => {
    const emojiUrl = generateEmojiUrl(emojiId)
    return `<img src="${emojiUrl}" alt="${emojiName}" class="emoji">`
  })

  formattedContent = formattedContent.replace(userMentionRegex, (match, userId) => {
    const user = props.message.mentions.find((user) => {
      return user.id === userId
    })
    const username = user?.global_name || user?.username || 'unknownUser'
    return `<span class="mention user-mention" data-user-id="${userId}">@${username}</span>`
  })

  formattedContent = formattedContent.replace(channelMentionRegex, (match, channelId) => {
    const channelName =
      props.message.mention_channels!.find((channel) => {
        return channel.id === channelId
      })?.name || 'unknowChannel'
    return `<span class="mention channel-mention" data-channel-id="${channelId}">@${channelName}</span>`
  })

  formattedContent = formattedContent.replace(roleMentionRegex, (match, roleId) => {
    const roleName =
      props.guild.roles.find((role) => {
        return role.id === roleId
      })?.name || 'unknowRole'
    return `<span class="mention role-mention" data-role-id="${roleId}">@${roleName}</span>`
  })

  formattedContent = formattedContent.replace(
    /(^|>)([^<]+)(<|$)/g,
    '$1<span style="display: inline-block; word-break: break-word; white-space: normal; max-width: 100%;">$2</span>$3',
  )

  return formattedContent
}

function generateAttachmentHtml(attachment: APIAttachment): string {
  if (attachment.content_type?.startsWith('image/')) {
    return `
        <img
            src="${attachment.url}"
            alt="${attachment.filename}"
            style="width: auto; height: auto;"
        />
    `
  } else {
    return `
    <a href="${attachment.url}" target="_blank" rel="noopener noreferrer">
      ${attachment.filename}
    </a>
  `
  }
}

function generateEmbedHtml(embed: APIEmbed): string {
  let embedHtml = ''
  if (embed.url) {
    embedHtml += `<a href="${embed.url}" target="_blank" rel="noopener noreferrer" class="embed-item" style="display: block; margin-bottom: 10px; text-decoration: none; color: inherit;">`
  } else {
    embedHtml += `<div class="embed-item" style="margin-bottom: 10px;">`
  }
  if (embed.title) {
    embedHtml += `
      <div class="embed-title" style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">
        ${embed.title}
      </div>
    `
  }
  if (embed.description) {
    embedHtml += `
      <div class="embed-description" style="font-size: 13px; margin-bottom: 10px;">
        ${embed.description}
      </div>
    `
  }
  if (embed.image) {
    embedHtml += `
      <div class="embed-image" style="margin-top: 5px;">
        <img
          src="${embed.image.url}"
          alt="${embed.title || 'Embed Image'}"
          style="max-width: 100%; border-radius: 5px;"
        />
      </div>
    `
  }
  if (embed.footer) {
    embedHtml += `
      <div class="embed-footer" style="display: flex; align-items: center; font-size: 12px; color: #72767d; margin-top: 5px;">
        <span>${embed.footer.text}</span>
        ${embed.footer.icon_url ? `<img src="${embed.footer.icon_url}" alt="${embed.footer.text}" style="width: 20px; height: 20px; margin-left: 5px; border-radius: 50%;" />` : ''}
      </div>
    `
  }
  if (embed.url) {
    embedHtml += `</a>`
  } else {
    embedHtml += `</div>`
  }
  return embedHtml
}

const formatTimestamp = (timestamp: string | number | Date): string => {
  const now = moment()
  const messageTime = moment(timestamp)

  if (messageTime.isSame(now, 'day')) {
    return `今天 ${messageTime.format('HH:mm')}`
  } else if (messageTime.isSame(now.subtract(1, 'days'), 'day')) {
    return `昨天 ${messageTime.format('HH:mm')}`
  } else {
    return messageTime.format('YYYY/MM/DD HH:mm')
  }
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

.mention {
  background-color: #5865f2;
  color: white;
  padding: 2px 4px;
  font-weight: bold;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
}

.message-row {
  padding: 10px 0;
  display: flex;
  align-items: flex-start;
}

.avatar-col {
  padding-right: 0;
}

.avatar {
  width: 40px;
  height: 40px;
}

.message-content-col {
  max-width: 100%;
  padding-left: 0;
}

.username {
  text-align: left;
  font-weight: bold;
  margin-bottom: 2px;
}

.timestamp {
  margin-left: 3px;
  color: #b9bbbe;
  font-size: 12px;
}

.message-content {
  text-align: left;
  margin-bottom: 5px;
}

.attachments {
  text-align: left;
  margin-top: 5px;
}

.attachment-item img,
.sticker-item {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  margin-top: 5px;
}

.stickers {
  text-align: left;
  margin-top: 5px;
}

.sticker-item {
  max-width: 150px;
  height: auto;
}

.embeds {
  margin-top: 10px;
  border-left: 4px solid #4f545c;
  background-color: #2f3136;
  padding: 10px;
  border-radius: 4px;
}

.embed-item {
  margin-bottom: 10px;
}

.embed-title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
  color: #ffffff;
}

.embed-description {
  font-size: 13px;
  margin-bottom: 10px;
  color: #b9bbbe;
}

.embed-image {
  margin-top: 5px;
  text-align: center;
}

.embed-image img {
  max-width: 100%;
  border-radius: 5px;
}

.embed-footer {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #72767d;
  margin-top: 5px;
}

.embed-footer img {
  width: 20px;
  height: 20px;
  margin-left: 5px;
  border-radius: 50%;
}
</style>
