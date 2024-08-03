<!-- eslint-disable max-len -->
<template>
  <div>
    <h3 v-if="channels.length === 0">載入中...</h3>
    <div v-else v-for="parentChannel of parentChannels" :key="parentChannel.id">
      <div
        class="row channel-row"
        style="margin-right: 0px; margin-left: 0px; margin-top: 10px"
        :data-bs-toggle="parentChannel.type === 4 ? 'collapse' : null"
        :data-bs-target="parentChannel.type === 4 ? `#collapse-${parentChannel.id}` : null"
        @click="
          parentChannel.type === 4
            ? handleShow(parentChannel.type, parentChannel.id)
            : openModal(parentChannel, checkPermission(guild, parentChannel))
        "
      >
        <div class="col-4" style="text-align: center">
          <span></span>
        </div>
        <div class="col" :id="parentChannel.id" style="text-align: left; padding-top: 11px; padding-bottom: 11px">
          <span style="font-weight: bold" :style="{ color: checkPermission(guild, parentChannel) ? 'inherit' : 'red' }">{{
            parentChannel.name
          }}</span>
        </div>
      </div>
      <div
        v-if="parentChannel.type === 4"
        style="margin-top: 10px"
        :id="`collapse-${parentChannel.id}`"
        class="collapse col-12"
        v-on="{ 'hide.bs.collapse': hidwCollapse, 'show.bs.collapse': showCollapse }"
      >
        <div v-if="visibleChildChannels.includes(parentChannel.id)">
          <div
            v-for="childChannel of getChildChannels(parentChannel.id)"
            class="channel-row row"
            @click="childChannel.type !== 4 ? openModal(childChannel, checkPermission(guild, childChannel)) : null"
            :key="childChannel.id"
          >
            <div class="col-5" style="text-align: center">
              <span></span>
            </div>
            <div class="col" :id="childChannel.id" style="text-align: left; padding-top: 11px; padding-bottom: 11px">
              <span :style="{ 'font-weight': 'bold', color: checkPermission(guild, childChannel) ? 'inherit' : 'red' }">{{ childChannel.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Modal ref="modalRef" :guild="guild" :guildRoles="guildRoles" :channels="channels" />
</template>

<script setup lang="ts">
import { PermissionFlagsBits, type APIGuildMember, type APIRole } from 'discord-api-types/v10'
import type { DiscordChannel } from '@/api/guild/dto/read-channel'
import { getChannelsApi, getMemberByUserIdAndGuildIdApi, getRoleByGuildIdApi } from '@/api/guild/guild'
import { ReadGuildsResponseDto } from '@/api/user/dto/read-user.dto'
import type { ApiResponse } from '@/common.class'
import { ref, toRaw, watch, type Ref } from 'vue'
import { UserStore } from './User'
import Modal from './ChannelModal.vue'

const { user } = UserStore()
const props = defineProps<{
  guild: ReadGuildsResponseDto
}>()
const channels: Ref<DiscordChannel[]> = ref([])
const parentChannels: Ref<DiscordChannel[]> = ref([])
const visibleChildChannels: Ref<string[]> = ref([])
const userRoleIds: Ref<string[]> = ref([])
const guildRoles: Ref<APIRole[]> = ref([])
const userPermission: Ref<bigint> = ref(BigInt(0))
const modalRef = ref<InstanceType<typeof Modal> | null>(null)

watch(
  () => props.guild,
  async (newGuild) => {
    if (newGuild) {
      {
        await getGuildRoles(newGuild.id)
      }
      {
        const response: ApiResponse<DiscordChannel> = await getChannelsApi(newGuild.id)
        const symbol = (type: number) => {
          switch (type) {
            case 0: {
              return '＃'
            }
            case 2: {
              return '🔊'
            }
            case 4: {
              return '▶'
            }
            case 5: {
              return '📢'
            }
            default: {
              return ''
            }
          }
        }
        channels.value = response.data as DiscordChannel[]
        channels.value.forEach((channel) => {
          return (channel.name = `${symbol(channel.type)} ${channel.name}`)
        })
        getParentAndNotParentChannels()
      }
      {
        const response: ApiResponse<APIGuildMember> = await getMemberByUserIdAndGuildIdApi(newGuild.id, user.value.discordUserId!)
        userRoleIds.value = (response.data as APIGuildMember).roles
      }
      {
        userPermission.value = calcUserRolesPermission(props.guild.id, guildRoles.value, userRoleIds.value)
      }
    }
  },
  { immediate: true },
)

function openModal(channel: DiscordChannel, haveViewPermission: boolean) {
  if (modalRef.value) {
    modalRef.value.openModal(channel, haveViewPermission)
  }
  console.log('------------------------------------')
  console.log(`使用者ID : ${user.value.discordUserId}`)
  console.log(`伺服器ID : ${props.guild.id}`)
  console.log(`頻道ID : ${channel.id}`)
  console.log(`使用者持有身分組 : `)
  console.log(toRaw(guildRoles.value).filter((role)=>{return userRoleIds.value.includes(role.id) || role.id === props.guild.id}))
  console.log(`頻道權限覆蓋設定 : `)
  console.log(toRaw(channel.permission_overwrites))
  console.log(`是否有無權限查看 : ${haveViewPermission}`)
  console.log('------------------------------------')
}

function showCollapse(event: Event) {
  const channelId = (event.target as HTMLElement).id.split('-')[1]
  const channel = parentChannels.value.find((parentChannel) => {
    return parentChannel.id === channelId
  })
  channel!.name = `▼${channel!.name.substring(1)}`
}

function hidwCollapse(event: Event) {
  const channelId = (event.target as HTMLElement).id.split('-')[1]
  const channel = parentChannels.value.find((parentChannel) => {
    return parentChannel.id === channelId
  })
  channel!.name = `▶${channel!.name.substring(1)}`
}

function handleShow(type: number, channelId: string) {
  if (type === 4 && !visibleChildChannels.value.includes(channelId)) {
    visibleChildChannels.value.push(channelId)
  }
}
function getParentAndNotParentChannels() {
  parentChannels.value = channels
    .value!.filter((channel) => channel.parent_id === null)
    .sort((a, b) => {
      if (a.type !== b.type) {
        return a.type - b.type
      }
      return a.position - b.position
    })
}
function getChildChannels(channelId: string) {
  return channels
    .value!.filter((channel) => channel.parent_id === channelId)
    .sort((a, b) => {
      if (a.type !== b.type) {
        return a.type - b.type
      }
      return a.position - b.position
    })
}
async function getGuildRoles(guildId: string) {
  const dcResponse = (await getRoleByGuildIdApi(guildId)) as ApiResponse<APIRole>
  guildRoles.value = dcResponse.data as APIRole[]
}

interface PermissionOverwrite {
  id: string
  type: number
  allow: string
  deny: string
}

function checkPermission(guild: ReadGuildsResponseDto, channel: DiscordChannel): boolean {
  if (guild.owner === true) {
    return true
  }
  const everyonePermissionOverwrite = calcEveryonePermissionOverwrite(guild.id, userPermission.value, channel.permission_overwrites)
  const rolesPermissionOverwrite = calcRolesPermissionOverwrite(everyonePermissionOverwrite, userRoleIds.value, channel.permission_overwrites)
  const userPermissionOverwrite = calcUserPermissionOverwrite(user.value.discordUserId!, rolesPermissionOverwrite, channel.permission_overwrites)
  const canViewChannel = (userPermissionOverwrite & PermissionFlagsBits.ViewChannel) === PermissionFlagsBits.ViewChannel
  return canViewChannel
}

function calcUserRolesPermission(guildId: string, guildRoles: APIRole[], userRoleIds: string[]): bigint {
  const everyonePermission = guildRoles.find((role) => {
    return role.id === guildId
  })!.permissions
  let lastPermission = BigInt(everyonePermission)
  const haveRoles: APIRole[] = []
  for (const roleId of userRoleIds) {
    const found = guildRoles.find((role) => {
      return role.id === roleId
    })
    if (found) {
      haveRoles.push(found)
    }
  }
  haveRoles.forEach((role) => {
    lastPermission |= BigInt(role.permissions)
  })
  return lastPermission
}

function calcEveryonePermissionOverwrite(guildId: string, userPermission: bigint, permissionOverwrites: PermissionOverwrite[]): bigint {
  let lastPermission = userPermission
  permissionOverwrites.forEach((permissionOverwrite) => {
    if (permissionOverwrite.id === guildId) {
      const allow = BigInt(permissionOverwrite.allow)
      const deny = BigInt(permissionOverwrite.deny)
      lastPermission &= ~deny
      lastPermission |= allow
    }
  })
  return lastPermission
}

function calcRolesPermissionOverwrite(currentPermission: bigint, userRoleIds: string[], permissionOverwrites: PermissionOverwrite[]): bigint {
  let lastPermission = currentPermission
  permissionOverwrites.forEach((permissionOverwrite) => {
    if (permissionOverwrite.type === 0 && userRoleIds.includes(permissionOverwrite.id)) {
      const allow = BigInt(permissionOverwrite.allow)
      const deny = BigInt(permissionOverwrite.deny)
      lastPermission &= ~deny
      lastPermission |= allow
    }
  })
  return lastPermission
}

function calcUserPermissionOverwrite(userId: string, userPermission: bigint, permissionOverwrites: PermissionOverwrite[]): bigint {
  let lastPermission = userPermission
  permissionOverwrites.forEach((permissionOverwrite) => {
    if (permissionOverwrite.type === 1 && permissionOverwrite.id === userId) {
      const allow = BigInt(permissionOverwrite.allow)
      const deny = BigInt(permissionOverwrite.deny)
      lastPermission &= ~deny
      lastPermission |= allow
      return lastPermission
    }
  })
  return lastPermission
}
</script>

<style>
.channel-row:hover {
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.channel-row:active {
  background-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 991.98px) {
  .channel-row {
    display: block;
    margin-top: 10px;
  }
}
</style>
