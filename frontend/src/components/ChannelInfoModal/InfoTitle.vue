<template>
  <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
    <div class="col-sm-3">
      <div v-if="guild.icon" class="col" style="text-align: center">
        <img class="rounded-circle" width="50px" height="50px" :src="`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`" />
      </div>
      <div v-else class="col" style="text-align: center">
        <img
          class="rounded-circle"
          width="50px"
          height="50px"
          :src="`https://www.pngkit.com/png/full/816-8165219_discord-logo-png-discord-icon.png`"
        />
      </div>
    </div>
    <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
      <span class="selectable-text" style="font-weight: bold; font-size: 18px">{{ guild.name }}</span>
    </div>
  </div>
  <div class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 10px">
    <div class="col" style="text-align: center">
      <span
        class="selectable-text"
        style="font-weight: bold; font-size: 18px"
        :style="{ color: getChannelNameColor(hasViewPermission, hasChannelManagePermission) }"
        >{{ channel.name }}</span
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import type { DiscordChannel } from '@/api/guild/dto/read-channel'
import type { APIGuild } from 'discord-api-types/v10'

function getChannelNameColor(hasViewPermission: boolean, hasChannelManagePermission: boolean) {
  if (hasChannelManagePermission) {
    console.log('#00bfff')
    return '#00bfff'
  } else if (hasViewPermission) {
    console.log('white')
    return 'white'
  } else {
    console.log('red')
    return 'red'
  }
}

defineProps<{
  guild: APIGuild
  channel: DiscordChannel
  hasViewPermission: boolean
  hasChannelManagePermission: boolean
}>()
</script>
