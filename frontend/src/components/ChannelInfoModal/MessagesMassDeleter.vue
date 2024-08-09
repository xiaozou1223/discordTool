<!-- eslint-disable max-len -->
<template>
  <div v-if="hasViewPermission" class="container" style="text-align: center; background: #322e2e; padding-top: 10px">
    <InfoTitle :channel="channel" :guild="guild" :has-view-permission="hasViewPermission" />
    <hr />
    <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
      <div class="col" style="text-align: center">
        <span v-if="hasChannelManagePermission" class="selectable-text" style="font-weight: bold; font-size: 18px; color: #00ec00">
          擁有頻道管理權限(可以刪除他人訊息)
        </span>
        <span v-else style="font-weight: bold; font-size: 18px; color: yellow"> 沒有頻道管理權限(只能刪除自己訊息) </span>
      </div>
    </div>
    <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
      <div class="col-3" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
        <span>發言者</span>
      </div>
      <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
        <select style="width: 90%; text-align: center" v-model="selectedMessageAuthorType">
          <option v-for="option of authorOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>
    <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
      <div class="col-3" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
        <span>userId</span>
      </div>
      <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
        <input
          style="width: 90%; text-align: center"
          type="text"
          :disabled="selectedMessageAuthorType !== MessageAuthorType.SpecificUser"
          @input="filterUserIdInput"
          v-model="authorId"
        />
      </div>
    </div>
    <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
      <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px; font-weight: bold">
        <span>訊息需要包含</span>
      </div>
    </div>
    <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
      <div class="col" style="padding-top: 5px; padding-bottom: 5px; font-weight: bold">
        <button
          v-for="option in options"
          :key="option.key"
          @click="toggleOption(option.key)"
          @touchstart="removeHover"
          @touchend="removeHover"
          :class="['btn', option.value ? 'btn-success' : 'btn-outline-info']"
          class="m-1"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
  <h4 v-else>無權限查看該頻道</h4>
</template>
<script setup lang="ts">
import type { DiscordChannel } from '@/api/guild/dto/read-channel'
import type { APIGuild } from 'discord-api-types/v10'
import InfoTitle from './InfoTitle.vue'
import { onMounted, ref, watch, type Ref } from 'vue'
interface SelectOption {
  value: string
  text: string
}
interface ButtonOption {
  label: string
  key: string
  value: boolean
}
enum MessageAuthorType {
  Self = 'Self',
  All = 'All',
  SpecificUser = 'SpecificUser',
}
const selectedMessageAuthorType: Ref<MessageAuthorType> = ref(MessageAuthorType.Self)
const authorOptions: Ref<SelectOption[]> = ref([])
const authorId: Ref<string> = ref('')
const props = defineProps<{
  userId: string
  guild: APIGuild
  channel: DiscordChannel
  hasViewPermission: boolean
  hasChannelManagePermission: boolean
}>()
const options = ref<ButtonOption[]>([
  { label: '連結', key: 'link', value: false },
  { label: '投票', key: 'poll', value: false },
  { label: '檔案', key: 'file', value: false },
  { label: '影片', key: 'video', value: false },
  { label: '圖片', key: 'image', value: false },
  { label: '音檔', key: 'sound', value: false },
  { label: '貼圖', key: 'sticker', value: false },
])

watch(
  () => props.channel,
  async () => {
    checkPermission()
  },
)

watch(selectedMessageAuthorType, (selectedType) => {
  if (selectedType === MessageAuthorType.Self) {
    authorId.value = props.userId
  } else {
    authorId.value = ''
  }
})
onMounted(async () => {
  checkPermission()
})

function checkPermission() {
  authorOptions.value = []
  if (props.hasViewPermission) {
    authorOptions.value.push({ value: MessageAuthorType.Self, text: '自己' })
    selectedMessageAuthorType.value = MessageAuthorType.Self
    authorId.value = props.userId
  }
  if (props.hasChannelManagePermission) {
    authorOptions.value.push({ value: MessageAuthorType.All, text: '所有人' })
    authorOptions.value.push({ value: MessageAuthorType.SpecificUser, text: '輸入userId' })
  }
}

function filterUserIdInput(event: Event) {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/[^0-9]/g, '')
  authorId.value = input.value
}

function toggleOption(key: string) {
  const option = options.value.find((opt) => opt.key === key)
  if (option) {
    option.value = !option.value
  }
}
function removeHover(event: Event) {
  const target = event.currentTarget as HTMLElement
  target.classList.remove('hover')
}
</script>
<style>
.selectable-text {
  user-select: text !important; /* For modern browsers */
  -webkit-user-select: text !important; /* For Safari */
  -moz-user-select: text !important; /* For Firefox */
  -ms-user-select: text !important; /* For Internet Explorer/Edge */
}
</style>
