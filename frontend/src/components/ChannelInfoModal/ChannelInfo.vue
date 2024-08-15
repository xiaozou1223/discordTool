<!-- eslint-disable max-len -->
<template>
  <div class="container" style="text-align: center; background: #322e2e; padding-top: 10px; padding-bottom: 10px">
    <InfoTitle
      :channel="channel"
      :guild="guild"
      :has-view-permission="hasViewPermission"
      :has-channel-manage-permission="hasChannelManagePermission"
    />
    <hr />
    <div class="row" style="margin-right: 0px; margin-left: 0px">
      <div class="col" style="text-align: center">
        <span class="selectable-text" style="font-weight: bold; font-size: 18px; color: white">身分組</span>
      </div>
    </div>
    <hr />
    <RoleSpanDiv :font-color="'#00bfff'" :roles="managerRoles" :is-manager="true" :has-view-permission="true" />
    <RoleSpanDiv :font-color="'white'" :roles="allowRoles" :is-manager="false" :has-view-permission="true" />
    <RoleSpanDiv :font-color="'red'" :roles="denyRoles" :is-manager="false" :has-view-permission="false" />
    <hr />
    <div class="row" style="margin-right: 0px; margin-left: 0px">
      <div class="col" style="text-align: center">
        <span class="selectable-text" style="font-weight: bold; font-size: 18px; color: white">成員</span>
      </div>
    </div>
    <hr />
    <MemberSpanDiv v-if="guildOwner" :font-color="'#FFD700'" :members="[guildOwner]" :is-manager="true" :has-view-permission="true" />
    <MemberSpanDiv :font-color="'while'" :members="allowMembers" :is-manager="false" :has-view-permission="true" />
    <MemberSpanDiv :font-color="'red'" :members="denyMembers" :is-manager="false" :has-view-permission="false" />
  </div>
</template>
<script setup lang="ts">
import type { DiscordChannel } from '@/api/guild/dto/read-channel'
import { getGuildMemberApi } from '@/api/guild/guild'
import { PermissionFlagsBits, type APIGuild, type APIGuildMember, type APIRole } from 'discord-api-types/v10'
import { ref, watch, onMounted, type Ref } from 'vue'
import { calcUserOwnChannelPermissions, hasRequiredPermission, calcRolesPermissionOverwrite } from '../../functions/Discord'
import InfoTitle from './InfoComponents/InfoTitle.vue'
import RoleSpanDiv from './InfoComponents/RoleSpanDiv.vue'
import MemberSpanDiv from './InfoComponents/MemberSpanDiv.vue'

const allowMembers: Ref<APIGuildMember[]> = ref([])
const allowRoles: Ref<APIRole[]> = ref([])
const denyMembers: Ref<APIGuildMember[]> = ref([])
const denyRoles: Ref<APIRole[]> = ref([])
const guildOwner: Ref<APIGuildMember | null> = ref(null)
const managerRoles: Ref<APIRole[]> = ref([])

const props = defineProps<{
  guild: APIGuild
  channel: DiscordChannel
  hasViewPermission: boolean
  hasChannelManagePermission: boolean
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
  guildOwner.value = null
  managerRoles.value = []
  allowRoles.value = []
  allowMembers.value = []
  denyRoles.value = []
  denyMembers.value = []
  const everyonePermission = props.guild.roles.find((role) => {
    return role.id === props.guild.id
  })!.permissions

  for (const role of props.guild.roles) {
    if ((BigInt(role.permissions) & PermissionFlagsBits.Administrator) === PermissionFlagsBits.Administrator) {
      managerRoles.value.push(role)
    }
  }
  {
    const getUserDataResult = await getGuildMemberApi(props.guild.id, props.guild.owner_id)
    const member = getUserDataResult.data as APIGuildMember
    guildOwner.value = member
  }
  {
    const hasEveryonePermissionOverWrite = channel.permission_overwrites.some((permissionOverwrite) => {
      return permissionOverwrite.id === props.guild.id
    })
    const everyoneRole = props.guild.roles.find((role) => {
      return role.id === props.guild.id
    })
    const everyoneHasViewPermission = (BigInt(everyoneRole!.permissions) & PermissionFlagsBits.ViewChannel) === PermissionFlagsBits.ViewChannel
    if (!hasEveryonePermissionOverWrite && everyoneHasViewPermission) {
      allowRoles.value.push(everyoneRole!)
    }
  }

  for (const permissionOverwrite of channel.permission_overwrites) {
    const isDuplicated: boolean = managerRoles.value.some((allowRole) => {
      return allowRole.id === permissionOverwrite.id
    })
    if (isDuplicated) {
      continue
    }
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
      const isDuplicated: boolean = permissionOverwrite.id === props.guild.owner_id
      if (isDuplicated) {
        continue
      }

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
