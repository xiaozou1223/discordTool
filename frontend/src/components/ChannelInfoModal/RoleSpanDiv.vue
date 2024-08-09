<!-- eslint-disable max-len -->
<template>
  <div v-for="role of roles" class="row" style="margin-right: 0px; margin-left: 0px; margin-top: 5px" :key="role.id">
    <div class="col-1" style="text-align: center; padding-top: 6px; padding-bottom: 6px">
      <span v-if="isManager" style="margin-right: 5px">⭐</span>
      <span v-if="!hasViewPermission" style="padding-top: 5px">🚫</span>
    </div>
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
    <div class="col" style="text-align: center; padding-top: 2px; padding-bottom: 2px">
      <span class="selectable-text" style="font-weight: bold; font-size: 18px" :style="{ color: fontColor }">{{ role.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { APIRole } from 'discord-api-types/v10'
defineProps<{
  hasViewPermission: boolean
  isManager: boolean
  roles: APIRole[]
  fontColor: string
}>()
</script>
