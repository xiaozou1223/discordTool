<template>
  <div
    v-for="member of members"
    class="row"
    style="margin-right: 0px; margin-left: 0px; margin-top: 2px; margin-block-end: 2px"
    :key="member.user.id"
    @click="console.log(member)"
  >
    <div class="col-1" style="text-align: center; padding-top: 10px; padding-bottom: 10px">
      <span v-if="isManager" style="padding-top: 5px">⭐</span>
      <span v-if="!hasViewPermission" style="padding-top: 5px">🚫</span>
    </div>
    <div class="col-2" style="text-align: center">
      <img class="rounded-circle" width="50px" height="50px" :src="generateUserAvatarUrl(member.user)" />
    </div>
    <div class="col" style="text-align: center; padding-top: 8px; padding-bottom: 8px">
      <span class="selectable-text" style="font-weight: bold; font-size: 18px" :style="{ color: fontColor }">
        {{ member.nick || member.user.global_name || member.user.username }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { APIGuildMember } from 'discord-api-types/v10'
import { generateUserAvatarUrl } from '../../functions/Discord'

defineProps<{
  hasViewPermission: boolean
  isManager: boolean
  members: APIGuildMember[]
  fontColor: string
}>()
</script>
