<template>
    <div>
        <h3 v-if="channels.length === 0">載入中...</h3>
            <div v-else v-for="parentChannel of parentChannels" >
                <div class="row channel-row" style="margin-right: 0px;margin-left: 0px;margin-top: 10px;" data-bs-toggle="collapse" :data-bs-target="`#collapse-${parentChannel.id}`" @click="handleShow(parentChannel.type,parentChannel.id)">
                    <div class="col-4" style="text-align: center;">
                        <span></span>
                    </div>
                    <div class="col" :id="parentChannel.id" style="text-align: left;padding-top: 11px;padding-bottom: 11px;">
                        <span style="font-weight: bold;">{{parentChannel.name}}</span>
                    </div>
                </div>
                <div v-if="parentChannel.type === 4" style="margin-top: 10px;" :id="`collapse-${parentChannel.id}`" class="collapse col-12">
                     <div v-if="visibleChildChannels.includes(parentChannel.id)" v-for="childChannel of getChildChannels(parentChannel.id)" class="channel-row row" @click="showP(childChannel)">
                        <div class="col-5" style="text-align: center;">
                            <span></span>
                        </div>
                        <div class="col" :id="childChannel.id" style="text-align: left;padding-top: 11px;padding-bottom: 11px;">
                            <span :style="{'font-weight': 'bold', 'color': checkPermission(childChannel) ? 'inherit' : 'red'}">{{childChannel.name}}</span>
                        </div>
                     </div>
                </div>
            </div>
    </div>
</template>




<script setup lang="ts">
    import { type APIGuildMember, type Permissions } from 'discord-api-types/v10';
    import type { DiscordChannel } from '@/api/guild/dto/read-channel';
    import { getChannelsApi,getMemberByUserIdAndGuildIdApi } from '@/api/guild/guild';
    import { ReadUserResponseDto } from '@/api/user/dto/read-user.dto';
    import type { ApiResponse } from '@/common.class';
    import { computed, ref, watch, type Ref } from 'vue';
    import { UserStore } from './User';

    const { user } = UserStore();
    const props = defineProps<{
        guildId: string,
    }>();
    const channels:Ref<DiscordChannel[]> = ref([]);
    const parentChannels:Ref<DiscordChannel[]> =ref([]);
    const visibleChildChannels: Ref<string[]> = ref([]);
    const myRoles: Ref<string[]> = ref([]);


    watch(() => props.guildId, async (newGuildId) => {
        if (newGuildId) {
            {
                const response:ApiResponse<DiscordChannel> = await getChannelsApi(newGuildId);
                const symbol = (type: number)=> {
                    switch(type){
                        case 0:{
                            return '＃'
                        }
                        case 2:{
                            return '🔊';
                        }
                        case 4:{
                            return '▶';
                        }
                        default:{
                            return '';
                        }
                    }
                };
                channels.value = response.data as DiscordChannel[];
                channels.value.forEach((channel)=>{
                    return channel.name = `${symbol(channel.type)} ${channel.name}`
                });
                getParentAndNotParentChannels();
            }
            {
                const response:ApiResponse<APIGuildMember> = await getMemberByUserIdAndGuildIdApi(newGuildId, user.value.discordUserId!);
                myRoles.value = (response.data as APIGuildMember).roles;
            }
        }
    }, { immediate: true });

    function showP(channel:DiscordChannel){ 
        console.log('------------------------------------');
        console.log(channel.name);
        console.log(channel.permission_overwrites);
        console.log('userId:'+ user.value.discordUserId);
        console.log('myrole:');
        console.log(myRoles.value);
        console.log('------------------------------------');
    }
    function handleShow(type:number, channelId: string) {
        if (type === 4 && !visibleChildChannels.value.includes(channelId)) {
            visibleChildChannels.value.push(channelId);
        }
    }
    function getParentAndNotParentChannels(){
        parentChannels.value =  channels.value!.filter((channel) => channel.parent_id === null)
            .sort((a, b) => {
                if (a.type !== b.type) {
                return a.type - b.type;
                }
                return a.position - b.position;
            });
    }
    function getChildChannels(channelId:string){
        return  channels.value!.filter((channel) => channel.parent_id === channelId)
                .sort((a, b) => {
                    if (a.type !== b.type) {
                    return a.type - b.type;
                    }
                    return a.position - b.position;
                });
    }
    function checkPermission(channel:DiscordChannel):boolean{
        if(channel.permission_overwrites.length === 0){
            return true;
        }
        for(const permission_overwrite of channel.permission_overwrites){
            if(permission_overwrite.type === 0 && hasPermissionToViewChannel(props.guildId,myRoles.value,channel.permission_overwrites)){
                   return true;
            }
             if(permission_overwrite.type === 0 && myRoles.value.includes(permission_overwrite.id) && permission_overwrite.allow !== '0'
             ||  permission_overwrite.type === 0 && myRoles.value.includes(permission_overwrite.id) && permission_overwrite.allow === '0' && permission_overwrite.deny === '0'){
                 return true;
             }
            if(permission_overwrite.type === 1 && permission_overwrite.id === user.value.discordUserId && permission_overwrite.allow !== '0'
            || permission_overwrite.type === 1 && permission_overwrite.id === user.value.discordUserId && permission_overwrite.allow === '0' && permission_overwrite.deny === '0'
        ){       
                    return true;
            }
        }
        return false;
    }

// 权限常量
const VIEW_CHANNEL = BigInt(0x400); // VIEW_CHANNEL 权限的位标识符

// 权限覆盖项接口
interface PermissionOverwrite {
    id: string;
    type: number;
    allow: string;
    deny: string;
}

// 通用权限计算函数
function calculatePermissions(guildId: string, userRoles: string[], permissionOverwrites: PermissionOverwrite[]): bigint {
    let allow = BigInt(0);
    let deny = BigInt(0);

    permissionOverwrites.forEach(overwrite => {
        if (userRoles.includes(overwrite.id) || overwrite.id === guildId) {
            allow |= BigInt(overwrite.allow);
            deny |= BigInt(overwrite.deny);
        }
    });

    // 计算最终权限
    const finalPermissions = allow & ~deny;
    return finalPermissions;
}

// 检查用户是否有权查看频道
function hasPermissionToViewChannel(guildId: string, userRoles: string[], permissionOverwrites: PermissionOverwrite[]): boolean {
    const finalPermissions = calculatePermissions(guildId, userRoles, permissionOverwrites);
    return (finalPermissions & VIEW_CHANNEL) === VIEW_CHANNEL;
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