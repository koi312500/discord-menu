import * as Discord from "discord.js"
import {
  ButtonInteraction,
  InteractionReplyOptions,
  SelectMenuInteraction,
} from "discord.js"
import { DiscordMenu } from "../menus"

export interface InteractionMenuOptions extends InteractionReplyOptions {
  menu: DiscordMenu
}

declare module "discord.js" {
  interface CommandInteraction {
    sendMenu(
      options: InteractionMenuOptions
    ): Promise<SelectMenuInteraction | ButtonInteraction | void>
  }
}

Discord.CommandInteraction.prototype.sendMenu = async function ({
  menu,
  ...options
}) {
  return menu.awaitFor(this, options)
}
