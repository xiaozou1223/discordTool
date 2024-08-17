<template>
  <div>
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
    <div
      class="row clickable-item"
      style="margin-right: 0px; margin-left: 0px; margin-top: 10px; background-color: #3c3c3c"
      data-bs-toggle="collapse"
      data-bs-target="#filter"
      @click="isFilterCollapse = !isFilterCollapse"
    >
      <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px; font-weight: bold">
        <span style="color: white">{{ isFilterCollapse ? '▶' : '▼' }} 篩選 {{ isFilterCollapse ? '◀' : '▼' }}</span>
      </div>
    </div>
    <div class="collapse" id="filter" style="background-color: #3c3c3c; padding-top: 10px; padding-bottom: 10px">
      <div>
        <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
          <div class="col-3" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
            <span>關鍵字</span>
          </div>
          <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
            <input type="text" v-model="keyword" style="width: 90%; text-align: center" />
          </div>
        </div>
        <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
          <div class="col-3" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
            <span>起始日</span>
          </div>
          <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
            <input type="date" v-model="startDate" :max="endDate || today" style="width: 90%; text-align: center" onkeydown="return false" />
          </div>
        </div>
        <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
          <div class="col-3" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
            <span>結束日</span>
          </div>
          <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
            <input
              type="date"
              v-model="endDate"
              :min="startDate || undefined"
              :max="today"
              style="width: 90%; text-align: center"
              onkeydown="return false"
            />
          </div>
        </div>
      </div>
      <div class="container" style="margin-top: 10px">
        <div class="row">
          <div class="col" style="text-align: center">
            <button
              v-for="option of options"
              :key="option.key"
              @click="toggleOption(option.key)"
              @touchstart="removeHover"
              @touchend="removeHover"
              :class="['selection-button', option.value ? 'selected' : 'unselected']"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
      <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
        <button type="button" class="btn btn-primary" @click="search">🔍搜尋訊息</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref, watch } from 'vue'
import moment from 'moment'
import type { DiscordChannel } from '@/api/guild/dto/read-channel'
import { generateDiscordSnowflakeFromDate } from '../../../functions/Discord'

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
interface FilterSetting {
  authorId: string
  searchQuery: string
}

const today: string = moment().format('YYYY-MM-DD')
const selectedMessageAuthorType: Ref<MessageAuthorType> = ref(MessageAuthorType.Self)
const isFilterCollapse = ref(true)
const authorOptions: Ref<SelectOption[]> = ref([])
const authorId: Ref<string> = ref('')
const keyword: Ref<string> = ref('')
const startDate = ref<string | null>(null)
const endDate = ref<string | null>(null)
const options = ref<ButtonOption[]>([
  { label: '🔗連結', key: 'link', value: false },
  { label: '📊投票', key: 'poll', value: false },
  { label: '📁檔案', key: 'file', value: false },
  { label: '🎥影片', key: 'video', value: false },
  { label: '🖼️圖片', key: 'image', value: false },
  { label: '🔊音檔', key: 'sound', value: false },
  { label: '😀貼圖', key: 'sticker', value: false },
])

const props = defineProps<{
  userId: string
  hasViewPermission: boolean
  hasChannelManagePermission: boolean
  channel: DiscordChannel
}>()

const emit = defineEmits<{
  (e: 'updateFilterSetting', filterSetting: FilterSetting): void
}>()

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

function search() {
  emit('updateFilterSetting', { authorId: authorId.value, searchQuery: generateSearchQuery() })
}

function generateSearchQuery() {
  let query = `channel_id=${props.channel.id}&include_nsfw=true`
  if (authorId.value) {
    query += `&author_id=${authorId.value}`
  }
  if (keyword.value) {
    query += `&content=${keyword.value}`
  }
  if (startDate.value) {
    const timestamp = moment(startDate.value).valueOf()
    const snowflake = generateDiscordSnowflakeFromDate(timestamp)
    query += `&min_id=${snowflake}`
  }
  if (endDate.value) {
    const timestamp = moment(endDate.value).valueOf()
    const snowflake = generateDiscordSnowflakeFromDate(timestamp)
    query += `&max_id=${snowflake}`
  }
  options.value.forEach((item) => {
    if (item.value) {
      query += `&has=${item.key}`
    }
  })
  return query
}

watch(selectedMessageAuthorType, (selectedType) => {
  if (selectedType === MessageAuthorType.Self) {
    authorId.value = props.userId
  } else {
    authorId.value = ''
  }
})

watch(
  () => props.channel,
  async () => {
    checkPermission()
  },
)

onMounted(async () => {
  checkPermission()
})
</script>

<style scoped>
.selection-button {
  max-width: 22%;
  min-width: 76px;
  width: 22%;
  display: inline-block;
  padding: 10px 10px;
  margin: 3px;
  border-radius: 8px;
  background-color: #7a5d8d;
  color: #d4bbdd;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  border: none;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.selection-button.unselected {
  background-color: transparent;
  border: 1px solid #d4bbdd;
  color: #d4bbdd;
}

.selection-button.selected {
  background-color: #7a5d8d;
  color: #ffffff;
  border: 1px solid #7a5d8d;
}

@media (any-hover: hover) {
  .selection-button:hover {
    background-color: #9a76b3;
    color: #ffffff;
  }

  .selection-button.selected:hover {
    background-color: #9a76b3;
    border: 1px solid #9a76b3;
  }
}
</style>
