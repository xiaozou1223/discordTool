import type { DiscordChannel } from '@/api/guild/dto/read-channel'
import { type APIGuild, type APIGuildMember, type APIRole, PermissionFlagsBits } from 'discord-api-types/v10'

export interface PermissionOverwrite {
  id: string
  type: number
  allow: string
  deny: string
}

export function calcUserOwnChannelPermissions(guild: APIGuild, channel: DiscordChannel, guildMember: APIGuildMember): bigint {
  const userPermission = calcUserOwnRolesPermission(guild, guildMember)
  const everyonePermissionOverwrite = calcEveryonePermissionOverwrite(guild.id, userPermission, channel.permission_overwrites)
  const rolesPermissionOverwrite = calcRolesPermissionOverwrite(everyonePermissionOverwrite, guildMember.roles, channel.permission_overwrites)
  const userPermissionOverwrite = calcUserPermissionOverwrite(guildMember.user.id, rolesPermissionOverwrite, channel.permission_overwrites)
  return userPermissionOverwrite
}

export function hasRequiredPermission(
  guild: APIGuild,
  guildMember: APIGuildMember,
  UserOwnChannelPermissions: bigint,
  PermissionFlagsBit: bigint,
): boolean {
  if (guild.owner_id === guildMember.user.id) {
    return true
  }
  if ((UserOwnChannelPermissions & PermissionFlagsBits.Administrator) === PermissionFlagsBits.Administrator) {
    return true
  }
  const hasPermission = (UserOwnChannelPermissions & PermissionFlagsBit) === PermissionFlagsBit
  return hasPermission
}

export function calcUserOwnRolesPermission(guild: APIGuild, guildMember: APIGuildMember): bigint {
  // 計算使用者持有之身分組之綜合權限
  const everyonePermission = guild.roles.find((role) => {
    return role.id === guild.id
  })!.permissions
  let lastPermission = BigInt(everyonePermission)
  const hasRoles: APIRole[] = []
  for (const roleId of guildMember.roles) {
    const found = guild.roles.find((role) => {
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
  // 計算@everyone權限覆蓋
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
  // 計算身分組權限覆蓋
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
  // 計算使用者權限覆蓋
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

export function generateDiscordSnowflakeFromDate(timestamp: number) {
  const discordEpoch = BigInt(1420070400000)
  const relativeTimestamp = BigInt(timestamp) - discordEpoch
  return (relativeTimestamp << BigInt(22)).toString()
}
