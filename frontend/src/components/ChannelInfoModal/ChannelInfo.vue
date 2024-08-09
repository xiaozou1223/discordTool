<!-- eslint-disable max-len -->
<template>
  <div class="container" style="text-align: center; background: #322e2e; padding-top: 10px">
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
        <span class="selectable-text" style="font-weight: bold; font-size: 18px" :style="{ color: hasViewPermission ? '#00EC00' : '#FF2D2D' }">{{
          channel.name
        }}</span>
      </div>
    </div>
    <hr />
    <div class="row" style="margin-right: 0px; margin-left: 0px">
      <div class="col" style="text-align: center">
        <span class="selectable-text" style="font-weight: bold; font-size: 18px; color: white">身分組</span>
      </div>
    </div>
    <hr />
    <div v-for="role of allowRoles" class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 5px" :key="role.id">
      <div class="col-2" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path
            :fill="`#${role.color.toString(16).padStart(6, '0')}`"
            fill-rule="evenodd"
            d="M3.47 5.18c.27-.4.64-.74 1.1-.96l6.09-3.05a3 3 0 0 1 2.68 0l6.1 3.05A2.83 2.83 0 0 1 21 6.75v3.5a14.17 14.17 0 0 1-8.42 12.5c-.37.16-.79.16-1.16 0A14.18 14.18 0 0 1 3 9.77V6.75c0-.57.17-1.11.47-1.57Zm2.95 10.3A12.18 12.18 0 0 0 12 20.82a12.18 12.18 0 0 0 5.58-5.32A9.49 9.49 0 0 0 12.47 14h-.94c-1.88 0-3.63.55-5.11 1.49ZM12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
            clip-rule="evenodd"
            class=""
          ></path>
        </svg>
      </div>
      <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
        <span class="selectable-text" style="font-weight: bold; font-size: 18px; color: white">{{ role.name }}</span>
      </div>
    </div>
    <div v-for="role of denyRoles" class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 5px" :key="role.id">
      <div class="col-2" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path
            :fill="`#${role.color.toString(16).padStart(6, '0')}`"
            fill-rule="evenodd"
            d="M3.47 5.18c.27-.4.64-.74 1.1-.96l6.09-3.05a3 3 0 0 1 2.68 0l6.1 3.05A2.83 2.83 0 0 1 21 6.75v3.5a14.17 14.17 0 0 1-8.42 12.5c-.37.16-.79.16-1.16 0A14.18 14.18 0 0 1 3 9.77V6.75c0-.57.17-1.11.47-1.57Zm2.95 10.3A12.18 12.18 0 0 0 12 20.82a12.18 12.18 0 0 0 5.58-5.32A9.49 9.49 0 0 0 12.47 14h-.94c-1.88 0-3.63.55-5.11 1.49ZM12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
            clip-rule="evenodd"
            class=""
          ></path>
        </svg>
      </div>
      <div class="col" style="text-align: center; padding-top: 5px; padding-bottom: 5px">
        <span class="selectable-text" style="font-weight: bold; font-size: 18px; color: red">{{ role.name }}</span>
      </div>
    </div>
    <hr />
    <div class="row" style="margin-right: 0px; margin-left: 0px">
      <div class="col" style="text-align: center">
        <span class="selectable-text" style="font-weight: bold; font-size: 18px; color: white">成員</span>
      </div>
    </div>
    <hr />
    <div
      v-for="member of allowMembers"
      class="row"
      style="margin-right: 0px; margin-left: 0px; margin-top: 2px; margin-block-end: 2px"
      :key="member.user.id"
      @click="console.log(member)"
    >
      <div class="col-2" style="text-align: center">
        <img
          v-if="member.user.avatar"
          class="rounded-circle"
          width="50px"
          height="50px"
          :src="`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`"
        />
        <img
          v-else
          class="rounded-circle"
          width="50px"
          height="50px"
          :src="`https://www.pngkit.com/png/full/816-8165219_discord-logo-png-discord-icon.png`"
        />
      </div>
      <div class="col" style="text-align: center">
        <span class="selectable-text" style="font-weight: bold; font-size: 18px; color: white">
          {{ member.nick || member.user.global_name || member.user.username }}</span
        >
      </div>
    </div>
    <div
      v-for="member of denyMembers"
      class="row"
      style="margin-right: 0px; margin-left: 0px; margin-top: 2px; margin-block-end: 2px"
      :key="member.user.id"
      @click="console.log(member)"
    >
      <div class="col-2" style="text-align: center">
        <img
          v-if="member.user.avatar"
          class="rounded-circle"
          width="50px"
          height="50px"
          :src="`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`"
        />
        <img
          v-else
          class="rounded-circle"
          width="50px"
          height="50px"
          :src="`https://www.pngkit.com/png/full/816-8165219_discord-logo-png-discord-icon.png`"
        />
      </div>
      <div class="col" style="text-align: center">
        <span class="selectable-text" style="font-weight: bold; font-size: 18px; color: red">
          {{ member.nick || member.user.global_name || member.user.username }}</span
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { DiscordChannel } from '@/api/guild/dto/read-channel'
import { getGuildMemberApi } from '@/api/guild/guild'
import { PermissionFlagsBits, type APIGuild, type APIGuildMember, type APIRole } from 'discord-api-types/v10'
import { ref, watch, onMounted, type Ref } from 'vue'
import { calcUserOwnChannelPermissions, hasRequiredPermission, calcRolesPermissionOverwrite } from '../Discord'

const allowMembers: Ref<APIGuildMember[]> = ref([])
const allowRoles: Ref<APIRole[]> = ref([])
const denyMembers: Ref<APIGuildMember[]> = ref([])
const denyRoles: Ref<APIRole[]> = ref([])

const props = defineProps<{
  guild: APIGuild
  channel: DiscordChannel
  hasViewPermission: boolean
  userGuildMemberInfo: APIGuildMember
}>()

onMounted(async () => {
  await calcRolesAndUsersViewChannelPermission(props.channel)
})
watch(
  () => props.channel,
  async (newChannel) => {
    await calcRolesAndUsersViewChannelPermission(newChannel)
  },
)

async function calcRolesAndUsersViewChannelPermission(channel: DiscordChannel) {
  allowRoles.value = []
  allowMembers.value = []
  denyRoles.value = []
  denyMembers.value = []
  const everyonePermission = props.guild.roles.find((role) => {
    return role.id === props.guild.id
  })!.permissions

  for (const permissionOverwrite of channel.permission_overwrites) {
    if (permissionOverwrite.type === 0) {
      const role = props.guild.roles.find((guildRole) => {
        return guildRole.id === permissionOverwrite.id
      })
      const rolePermission = BigInt(everyonePermission) | BigInt(role!.permissions)
      const lastPermission = calcRolesPermissionOverwrite(rolePermission, [permissionOverwrite.id], [permissionOverwrite])
      const canViewChannel = (lastPermission & PermissionFlagsBits.ViewChannel) === PermissionFlagsBits.ViewChannel
      if (channel.id !== props.channel.id) {
        //防止數據汙染
        return
      }
      if (canViewChannel) {
        allowRoles.value.push(role!)
      } else {
        denyRoles.value.push(role!)
      }
    }
  }
  for (const permissionOverwrite of channel.permission_overwrites) {
    if (permissionOverwrite.type === 1) {
      const getUserDataResult = await getGuildMemberApi(props.guild.id, permissionOverwrite.id)
      const member = getUserDataResult.data as APIGuildMember
      const hasViewChannelPermission = checkMemberViewChannelPermission(member, props.guild, channel)
      if (channel.id !== props.channel.id) {
        //防止數據汙染
        return
      }
      if (hasViewChannelPermission) {
        allowMembers.value.push(member)
      } else {
        denyMembers.value.push(member)
      }
    }
  }
}

function checkMemberViewChannelPermission(guildMember: APIGuildMember, guild: APIGuild, channel: DiscordChannel) {
  const userOwnChannelPermissions = calcUserOwnChannelPermissions(guild, channel, guildMember)
  return hasRequiredPermission(guild, guildMember, userOwnChannelPermissions, PermissionFlagsBits.ViewChannel)
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
