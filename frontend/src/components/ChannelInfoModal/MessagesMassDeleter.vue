<!-- eslint-disable max-len -->
<template>
  <div v-if="hasViewPermission" class="container" style="text-align: center; background: #322e2e; padding-top: 10px; padding-bottom: 10px">
    <InfoTitle
      :channel="channel"
      :guild="guild"
      :has-view-permission="hasViewPermission"
      :has-channel-manage-permission="hasChannelManagePermission"
    />
    <hr />
    <MessageSearcher
      :userId="userId"
      :channel="channel"
      :has-view-permission="hasViewPermission"
      :has-channel-manage-permission="hasChannelManagePermission"
    />
  </div>
  <h4 v-else>無權限查看該頻道</h4>
</template>

<script setup lang="ts">
import type { DiscordChannel } from '@/api/guild/dto/read-channel'
import type { APIGuild } from 'discord-api-types/v10'
import moment from 'moment'
import InfoTitle from './InfoTitle.vue'
import { onMounted, ref, watch, type Ref } from 'vue'
import MessageSearcher from './MessageSearcher.vue'
const props = defineProps<{
  userId: string
  guild: APIGuild
  channel: DiscordChannel
  hasViewPermission: boolean
  hasChannelManagePermission: boolean
}>()
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
