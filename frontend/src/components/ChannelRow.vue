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
            : openModal(parentChannel, calcUserOwnChannelPermissions(guild!, parentChannel, userGuildMemberInfo!))
        "
      >
        <div class="col-2 col-lg-4" style="text-align: center">
          <span></span>
        </div>
        <div class="col" :id="parentChannel.id" style="text-align: left; padding-top: 11px; padding-bottom: 11px">
          <span style="font-weight: bold" :style="{ color: checkViewChannelPermission(guild!, parentChannel) ? 'inherit' : 'red' }">{{
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
            @click="
              childChannel.type !== 4 ? openModal(childChannel, calcUserOwnChannelPermissions(guild!, childChannel, userGuildMemberInfo!)) : null
            "
            :key="childChannel.id"
          >
            <div class="col-3" style="text-align: center">
              <span></span>
            </div>
            <div class="col" :id="childChannel.id" style="text-align: left; padding-top: 11px; padding-bottom: 11px">
              <span :style="{ 'font-weight': 'bold', color: checkViewChannelPermission(guild!, childChannel) ? 'inherit' : 'red' }">{{
                childChannel.name
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ChannelActionsModal ref="modalRef" :guild="guild!" :channels="channels" :user-guild-member-info="userGuildMemberInfo!" />
</template>

<script setup lang="ts">
import { PermissionFlagsBits, type APIGuild, type APIGuildMember } from 'discord-api-types/v10'
import type { DiscordChannel } from '@/api/guild/dto/read-channel'
import { getChannelsApi, getGuildApi, getMemberByUserIdAndGuildIdApi } from '@/api/guild/guild'
import type { ApiResponse } from '@/common.class'
import { ref, toRaw, watch, type Ref } from 'vue'
import { UserStore } from './User'
import ChannelActionsModal from './ChannelInfoModal/ChannelActionsModal.vue'
import { hasRequiredPermission, calcUserOwnChannelPermissions, calcUserOwnRolesPermission, getChannelSymbol } from './Discord'

const { user } = UserStore()
const props = defineProps<{
  guildId: string
}>()
const channels: Ref<DiscordChannel[]> = ref([])
const parentChannels: Ref<DiscordChannel[]> = ref([])
const visibleChildChannels: Ref<string[]> = ref([])
const userGuildMemberInfo: Ref<APIGuildMember | null> = ref(null)
const guild: Ref<APIGuild | null> = ref(null)
const userPermission: Ref<bigint> = ref(BigInt(0))
const modalRef = ref<InstanceType<typeof ChannelActionsModal> | null>(null)

watch(
  () => props.guildId,
  async (newGuildId) => {
    if (newGuildId) {
      {
        guild.value = await getGuildInfo(newGuildId)
      }
      {
        const response: ApiResponse<APIGuildMember> = await getMemberByUserIdAndGuildIdApi(newGuildId, user.value.discordUserId!)
        userGuildMemberInfo.value = response.data as APIGuildMember
      }
      {
        const response: ApiResponse<DiscordChannel> = await getChannelsApi(newGuildId)
        channels.value = response.data as DiscordChannel[]
        channels.value.forEach((channel) => {
          return (channel.name = `${getChannelSymbol(channel.type)} ${channel.name}`)
        })
        getParentAndNotParentChannels()
      }
      {
        userPermission.value = calcUserOwnRolesPermission(guild.value, userGuildMemberInfo.value)
      }
    }
  },
  { immediate: true },
)

async function getGuildInfo(guildId: string) {
  const result = await getGuildApi(guildId)
  return result.data! as APIGuild
}

function checkViewChannelPermission(guild: APIGuild, channel: DiscordChannel): boolean {
  const userOwnChannelPermissions = calcUserOwnChannelPermissions(guild, channel, userGuildMemberInfo.value!)
  return hasRequiredPermission(guild, userGuildMemberInfo.value!, userOwnChannelPermissions, PermissionFlagsBits.ViewChannel)
}

function openModal(channel: DiscordChannel, userOwnChannelPermissions: bigint) {
  console.log('------------------------------------')
  console.log(`使用者ID : ${user.value.discordUserId}`)
  console.log(`伺服器名稱 : ${props.guildId}`)
  console.log(`伺服器ID : ${props.guildId}`)
  console.log(`頻道名稱 : ${channel.name}`)
  console.log(`頻道ID : ${channel.id}`)
  console.log(`使用者持有身分組 : `)
  console.log(
    toRaw(guild.value!.roles).filter((role) => {
      return userGuildMemberInfo.value!.roles.includes(role.id) || role.id === props.guildId
    }),
  )
  console.log(`頻道權限覆蓋設定 : `)
  console.log(toRaw(channel.permission_overwrites))
  console.log(`有無權限查看 : ${checkViewChannelPermission(guild.value!, channel)}`)
  console.log('------------------------------------')
  if (modalRef.value) {
    modalRef.value.openModal(channel, userOwnChannelPermissions)
  }
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
