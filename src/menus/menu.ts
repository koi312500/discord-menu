import {
  ButtonInteraction,
  CacheType,
  CommandInteraction,
  InteractionReplyOptions,
  SelectMenuInteraction,
} from "discord.js"

export abstract class DiscordMenu {
  async awaitFor(
    i: CommandInteraction,
    options: InteractionReplyOptions
  ): Promise<
    SelectMenuInteraction<CacheType> | ButtonInteraction<CacheType> | null
  > {
    return null
  }
}
