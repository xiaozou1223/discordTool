import type { DiscordChannel } from '@/api/guild/dto/read-channel'
import type { ReadGuildsResponseDto, ReadUserResponseDto } from '@/api/user/dto/read-user.dto'
import type { APIRole } from 'discord-api-types/v10'

export interface PermissionOverwrite {
  id: string
  type: number
  allow: string
  deny: string
}

export function calcUserOwnChannelPermissions(
  guild: ReadGuildsResponseDto,
  channel: DiscordChannel,
  userPermission: bigint,
  userOwnRoleIds: string[],
  user: ReadUserResponseDto,
) {
  const everyonePermissionOverwrite = calcEveryonePermissionOverwrite(guild.id, userPermission, channel.permission_overwrites)
  const rolesPermissionOverwrite = calcRolesPermissionOverwrite(everyonePermissionOverwrite, userOwnRoleIds, channel.permission_overwrites)
  const userPermissionOverwrite = calcUserPermissionOverwrite(user.discordUserId!, rolesPermissionOverwrite, channel.permission_overwrites)
  return userPermissionOverwrite
}

export function hasRequiredPermission(isOwner: boolean, UserOwnChannelPermissions: bigint, PermissionFlagsBit: bigint): boolean {
  if (isOwner) {
    return true
  }
  const hasPermission = (UserOwnChannelPermissions & PermissionFlagsBit) === PermissionFlagsBit
  return hasPermission
}

export function calcUserRolesPermission(guildId: string, guildRoles: APIRole[], userRoleIds: string[]): bigint {
  const everyonePermission = guildRoles.find((role) => {
    return role.id === guildId
  })!.permissions
  let lastPermission = BigInt(everyonePermission)
  const hasRoles: APIRole[] = []
  for (const roleId of userRoleIds) {
    const found = guildRoles.find((role) => {
      return role.id === roleId
    })
    if (found) {
      hasRoles.push(found)
    }
  }
  hasRoles.forEach((role) => {
    lastPermission |= BigInt(role.permissions)
  })
  return lastPermission
}

export function calcEveryonePermissionOverwrite(guildId: string, userPermission: bigint, permissionOverwrites: PermissionOverwrite[]): bigint {
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

export function calcRolesPermissionOverwrite(currentPermission: bigint, userRoleIds: string[], permissionOverwrites: PermissionOverwrite[]): bigint {
  let lastPermission = currentPermission
  const allows: string[] = []
  const denys: string[] = []
  permissionOverwrites.forEach((permissionOverwrite) => {
    if (permissionOverwrite.type === 0 && userRoleIds.includes(permissionOverwrite.id)) {
      allows.push(permissionOverwrite.allow)
      denys.push(permissionOverwrite.deny)
    }
  })
  denys.forEach((deny) => {
    lastPermission &= ~BigInt(deny)
  })
  allows.forEach((allow) => {
    lastPermission |= BigInt(allow)
  })
  return lastPermission
}

export function calcUserPermissionOverwrite(userId: string, userPermission: bigint, permissionOverwrites: PermissionOverwrite[]): bigint {
  let lastPermission = userPermission
  const userPermissionOverwrite = permissionOverwrites.find((permissionOverwrite) => {
    return permissionOverwrite.type === 1 && permissionOverwrite.id === userId
  })
  if (userPermissionOverwrite) {
    const allow = BigInt(userPermissionOverwrite.allow)
    const deny = BigInt(userPermissionOverwrite.deny)
    lastPermission &= ~deny
    lastPermission |= allow
  }
  return lastPermission
}

export function getChannelSymbol(channelType: number) {
  switch (channelType) {
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
