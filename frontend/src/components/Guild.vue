<template>
    <Nav/>
    <section class="py-5">
        <div class="container py-5" style="text-align: center;background: #322e2e;" >
            <div v-for="guild of guilds">
            <div class="row guild-row" style="margin-right: 0px;margin-left: 0px;margin-top: 10px;" data-bs-toggle="collapse" :data-bs-target="`#collapse-${guild.id}`" @click="handleShow(guild.id)">
                    <div v-if="guild.icon" class="col-4" style="text-align: center;"><img class="rounded-circle" width="50px" height="50px" :src="`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`"></div>
                    <div v-else class="col-4" style="text-align: center;"><img class="rounded-circle" width="50px" height="50px" :src="`https://www.pngkit.com/png/full/816-8165219_discord-logo-png-discord-icon.png`"></div>
                    <div class="col" style="text-align: left;padding-top: 11px;padding-bottom: 11px;"><span style="margin-left: 10px;font-weight: bold;">{{guild.name}}</span></div>
            </div>
                <div style="margin-top: 10px;" :id="`collapse-${guild.id}`" class="collapse col-12">
                    <Channel v-if="visibleGuilds.includes(guild.id)" :guild-id="guild.id"  />
                </div>
            </div>
        </div>
    </section>
</template>


<script setup lang="ts">
    import Nav from './home/Nav.vue'
    import Channel from './Channel.vue'
    import { getGuildsApi } from '@/api/user/user';
    import { ReadGuildsResponseDto, ReadUserResponseDto } from '@/api/user/dto/read-user.dto';
    import { ref, watch, type Ref } from 'vue';
    import type { ApiResponse } from '@/common.class';
    import router from '@/router';
    import { UserStore } from './User';

    const { user } = UserStore();
    const guilds:Ref<ReadGuildsResponseDto[]> = ref([])
    const visibleGuilds: Ref<string[]> = ref([]);

    async function loadData(){
        guilds.value = (await getGuildsApi(user.value.account)).data as ReadGuildsResponseDto[];
    }
    watch(user, async (newUser, oldUser) => {
        if (!oldUser && newUser.account !== undefined || oldUser && newUser.account !== oldUser.account) {
            console.log('LoadGuild!');
            await loadData();
        }
    }, { immediate: true });

    function handleShow(guildId: string) {
        if (!visibleGuilds.value.includes(guildId)) {
            visibleGuilds.value.push(guildId);
        }
    }

</script>

<style>
    .guild-row:hover {
        background-color: rgba(255, 255, 255, 0.1);
        cursor: pointer;
    }

    .guild-row:active {
        background-color: rgba(255, 255, 255, 0.2);
    }
    span{
        user-select: none; /* For modern browsers */
        -webkit-user-select: none; /* For Safari */
        -moz-user-select: none; /* For Firefox */
        -ms-user-select: none; /* For Internet Explorer/Edge */
    }

    @media (max-width: 991.98px) {
        .guild-row {
            display: block;
            margin-top: 10px;
        }
    }
</style>