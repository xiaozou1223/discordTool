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
                v-if="
                  channel.type === 0 && hasRequiredPermission(guild, userGuildMemberInfo, userOwnChannelPermissions, PermissionFlagsBits.ViewChannel)
                "
                @click="switchPage(Page.script)"
                class="nav-link"
                style="font-weight: bold; font-size: 18px; color: white"
                >批量刪除</a
              >
            </li>
            <li class="nav-item">
              <a
                v-if="
                  channel.type === 0 && hasRequiredPermission(guild, userGuildMemberInfo, userOwnChannelPermissions, PermissionFlagsBits.ViewChannel)
                "
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
            :has-view-permission="hasRequiredPermission(guild, userGuildMemberInfo, userOwnChannelPermissions, PermissionFlagsBits.ViewChannel)"
            :channel="channel"
            :user-guild-member-info="userGuildMemberInfo"
          />
          <MessagesMassDeleter
            v-if="page === Page.script"
            :channel="channel"
            :guild="guild!"
            :has-view-permission="hasRequiredPermission(guild, userGuildMemberInfo, userOwnChannelPermissions, PermissionFlagsBits.ViewChannel)"
            :has-channel-manage-permission="
              hasRequiredPermission(guild, userGuildMemberInfo, userOwnChannelPermissions, PermissionFlagsBits.ManageChannels)
            "
            :user-id="user.discordUserId!"
          />
          <MessageWatcher v-if="page === Page.listening" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DiscordChannel } from '@/api/guild/dto/read-channel'
import { PermissionFlagsBits, type APIGuild, type APIGuildMember } from 'discord-api-types/v10'
import { ref, defineExpose, type Ref } from 'vue'
import ChannelInfo from './ChannelInfo.vue'
import MessagesMassDeleter from './MessagesMassDeleter.vue'
import MessageWatcher from './MessageWatcher.vue'
import { hasRequiredPermission } from '../Discord'
import { UserStore } from '../User'
enum Page {
  none,
  info,
  script,
  listening,
}

const userOwnChannelPermissions: Ref<bigint> = ref(BigInt(0))
const showModal: Ref<boolean> = ref(false)
const channel: Ref<DiscordChannel> = ref(new DiscordChannel())
const page: Ref<Page> = ref(Page.none)
const { user } = UserStore()

defineProps<{
  guild: APIGuild
  channels: DiscordChannel[]
  userGuildMemberInfo: APIGuildMember
}>()

async function openModal(inputChannel: DiscordChannel, newUserOwnChannelPermissions: bigint) {
  channel.value = inputChannel
  showModal.value = true
  userOwnChannelPermissions.value = newUserOwnChannelPermissions
  page.value = Page.info
}

defineExpose({
  openModal,
})

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
