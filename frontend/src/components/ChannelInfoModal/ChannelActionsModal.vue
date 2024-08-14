<!-- eslint-disable max-len -->
<template>
  <div
    class="modal fade"
    :class="{ show: showModal }"
    tabindex="-1"
    role="dialog"
    :style="{ display: showModal ? 'block' : 'none', 'background-color': 'rgba(0, 0, 0, 0.5)' }"
  >
    <div class="modal-dialog modal-dialog-scrollable" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <ul class="nav">
            <li class="nav-item">
              <a
                @click="switchPage(Page.info)"
                class="nav-link clickable-item"
                style="font-weight: bold; font-size: 18px"
                :style="{ color: page === Page.info ? '#00bfff' : '#cccccc' }"
                >詳細資訊</a
              >
            </li>
            <li class="nav-item">
              <a
                v-if="
                  channel.type === 0 && hasRequiredPermission(guild, userGuildMemberInfo, userOwnChannelPermissions, PermissionFlagsBits.ViewChannel)
                "
                @click="switchPage(Page.massDeleter)"
                class="nav-link clickable-item"
                style="font-weight: bold; font-size: 18px"
                :style="{ color: page === Page.massDeleter ? '#00bfff' : '#cccccc' }"
                >批量刪除</a
              >
            </li>
            <li class="nav-item">
              <a
                v-if="
                  channel.type === 0 && hasRequiredPermission(guild, userGuildMemberInfo, userOwnChannelPermissions, PermissionFlagsBits.ViewChannel)
                "
                @click="switchPage(Page.listening)"
                class="nav-link clickable-item"
                style="font-weight: bold; font-size: 18px"
                :style="{ color: page === Page.listening ? '#00bfff' : '#cccccc' }"
                >監聽</a
              >
            </li>
          </ul>
          <button class="btn-close btn-close-white" type="button" aria-label="Close" @click="showModal = false"></button>
        </div>
        <div class="modal-body" style="height: 80vh">
          <keep-alive>
            <ChannelInfo
              v-if="page === Page.info"
              :key="channel.id"
              :guild="guild"
              :has-view-permission="hasRequiredPermission(guild, userGuildMemberInfo, userOwnChannelPermissions, PermissionFlagsBits.ViewChannel)"
              :has-channel-manage-permission="
                hasRequiredPermission(guild, userGuildMemberInfo, userOwnChannelPermissions, PermissionFlagsBits.ManageChannels)
              "
              :channel="channel"
              :user-guild-member-info="userGuildMemberInfo"
            />
          </keep-alive>
          <keep-alive>
            <MessagesMassDeleter
              v-if="page === Page.massDeleter"
              :key="channel.id"
              :channel="channel"
              :guild="guild"
              :guild-channels="guildChannels"
              :has-view-permission="hasRequiredPermission(guild, userGuildMemberInfo, userOwnChannelPermissions, PermissionFlagsBits.ViewChannel)"
              :has-channel-manage-permission="
                hasRequiredPermission(guild, userGuildMemberInfo, userOwnChannelPermissions, PermissionFlagsBits.ManageChannels)
              "
              :user-id="userStore.user.discordUserId!"
            />
          </keep-alive>
          <keep-alive>
            <MessageWatcher v-if="page === Page.listening" />
          </keep-alive>
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
import { hasRequiredPermission } from '../../functions/Discord'
import { useUserStore } from '../../stores/useUserStore'
enum Page {
  none,
  info,
  massDeleter,
  listening,
}

const userOwnChannelPermissions: Ref<bigint> = ref(BigInt(0))
const showModal: Ref<boolean> = ref(false)
const channel: Ref<DiscordChannel> = ref(new DiscordChannel())
const page: Ref<Page> = ref(Page.none)
const userStore = useUserStore()

defineProps<{
  guild: APIGuild
  guildChannels: DiscordChannel[]
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
</style>
