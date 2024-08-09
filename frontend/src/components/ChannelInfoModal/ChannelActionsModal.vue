<!-- eslint-disable max-len -->
<template>
  <div
    class="modal fade"
    :class="{ show: showModal }"
    tabindex="-1"
    role="dialog"
    :style="{ display: showModal ? 'block' : 'none', 'background-color': 'rgba(0, 0, 0, 0.5)' }"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <ul class="nav">
            <li class="nav-item">
              <a @click="switchPage(Page.info)" class="nav-link" style="font-weight: bold; font-size: 18px; color: white">詳細資訊</a>
            </li>
            <li class="nav-item">
              <a
                v-if="channel.type === 0 && hasViewPermission"
                @click="switchPage(Page.script)"
                class="nav-link"
                style="font-weight: bold; font-size: 18px; color: white"
                >批量刪除</a
              >
            </li>
            <li class="nav-item">
              <a
                v-if="channel.type === 0 && hasViewPermission"
                @click="switchPage(Page.listening)"
                class="nav-link"
                style="font-weight: bold; font-size: 18px; color: white"
                >監聽</a
              >
            </li>
          </ul>
          <button class="btn-close btn-close-white" type="button" aria-label="Close" @click="showModal = false"></button>
        </div>
        <div class="modal-body">
          <ChannelInfo
            v-if="page === Page.info"
            :guild="guild"
            :allowUsers="allowUsers"
            :allowRoles="allowRoles"
            :has-view-permission="hasViewPermission"
            :channel="channel"
            :deny-roles="denyRoles"
            :deny-users="denyUsers"
          />
          <h3 v-if="page === Page.listening"><MessageWatcher /></h3>
          <h3 v-if="page === Page.script">
            <!-- <MessagesMassDeleter /> -->
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DiscordChannel } from '@/api/guild/dto/read-channel'
import { getGuildMemberApi } from '@/api/guild/guild'
import type { ReadGuildsResponseDto } from '@/api/user/dto/read-user.dto'
import { PermissionFlagsBits, type APIGuildMember, type APIRole } from 'discord-api-types/v10'
import { ref, defineExpose, type Ref } from 'vue'
import ChannelInfo from './ChannelInfo.vue'
import MessagesMassDeleter from './MessagesMassDeleter.vue'
import MessageWatcher from './MessageWatcher.vue'
enum Page {
  info,
  script,
  listening,
}

const showModal: Ref<boolean> = ref(false)
const channel: Ref<DiscordChannel> = ref(new DiscordChannel())
const page: Ref<Page> = ref(Page.info)
const allowUsers: Ref<APIGuildMember[]> = ref([])
const allowRoles: Ref<APIRole[]> = ref([])
const denyUsers: Ref<APIGuildMember[]> = ref([])
const denyRoles: Ref<APIRole[]> = ref([])
const hasViewPermission: Ref<boolean> = ref(false)

const props = defineProps<{
  guildRoles: APIRole[]
  guild: ReadGuildsResponseDto
  channels: DiscordChannel[]
}>()

async function openModal(inputChannel: DiscordChannel, ViewPermission: boolean) {
  channel.value = inputChannel
  showModal.value = true
  hasViewPermission.value = ViewPermission
  page.value = Page.info
  await parsePermission(channel.value)
}

defineExpose({
  openModal,
})

async function parsePermission(channel: DiscordChannel) {
  allowRoles.value = []
  allowUsers.value = []
  denyRoles.value = []
  denyUsers.value = []
  const everyonePermission = props.guildRoles.find((role) => {
    return role.id === props.guild.id
  })!.permissions
  for (const permissionOverwrite of channel.permission_overwrites) {
    if (permissionOverwrite.type === 0) {
      const role = props.guildRoles.find((guildRole) => {
        return guildRole.id === permissionOverwrite.id
      })
      const rolePermission = BigInt(everyonePermission) | BigInt(role!.permissions)
      let lastPermission = BigInt(rolePermission)
      const allow = BigInt(permissionOverwrite.allow)
      const deny = BigInt(permissionOverwrite.deny)
      lastPermission &= ~deny
      lastPermission |= allow
      const canViewChannel = (lastPermission & PermissionFlagsBits.ViewChannel) === PermissionFlagsBits.ViewChannel

      if (canViewChannel) {
        allowRoles.value.push(role!)
      } else {
        denyRoles.value.push(role!)
      }
    }
  }
  for (const permissionOverwrite of channel.permission_overwrites) {
    if (permissionOverwrite.type === 1) {
      let lastPermission = BigInt(everyonePermission)
      const allow = BigInt(permissionOverwrite.allow)
      const deny = BigInt(permissionOverwrite.deny)
      lastPermission &= ~deny
      lastPermission |= allow
      const canViewChannel = (lastPermission & PermissionFlagsBits.ViewChannel) === PermissionFlagsBits.ViewChannel
      const result = await getGuildMemberApi(props.guild.id, permissionOverwrite.id)
      const user = result.data as APIGuildMember
      if (canViewChannel) {
        allowUsers.value.push(user)
      } else {
        denyUsers.value.push(user)
      }
    }
  }
}

function switchPage(goPage: Page) {
  page.value = goPage
}
</script>

<style>
.modal.show {
  display: block;
}

.nav-link {
  color: white !important;
  font-weight: bold;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.nav-link:active {
  background-color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 991.98px) {
  .nav-link {
    display: block;
    margin-top: 10px;
  }
}

a {
  user-select: none; /* For modern browsers */
  -webkit-user-select: none; /* For Safari */
  -moz-user-select: none; /* For Firefox */
  -ms-user-select: none; /* For Internet Explorer/Edge */
}
</style>
