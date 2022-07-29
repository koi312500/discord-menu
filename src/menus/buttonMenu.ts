import { DiscordMenu } from "./menu"
import {
  ActionRowBuilder,
  ButtonStyle,
  CommandInteraction,
  InteractionReplyOptions,
  MessageActionRowComponentBuilder,
} from "discord.js"

export abstract class ButtonMenu extends DiscordMenu {
  components: ActionRowBuilder<MessageActionRowComponentBuilder>[] = []
  afterReact: "ResetComponents" | "DisableComponents" = "ResetComponents"

  async setAfterReact(handle: "ResetComponents" | "DisableComponents") {
    this.afterReact = handle
  }

  async awaitFor(i: CommandInteraction, options: InteractionReplyOptions) {
    if (!options.components) options.components = []
    options.components.push(...this.components)

    let message
    if (i.isRepliable()) {
      message = await i.reply(options)
    } else {
      message = await i.editReply(options)
    }

    try {
      const resI = await message.awaitMessageComponent({
        time: 15000,
      })
      if (this.afterReact === "ResetComponents") {
        await i.editReply(Object.assign(options, { components: [] }))
      }
      return resI
    } catch (e) {
      if (this.afterReact === "ResetComponents") {
        await i.editReply(Object.assign(options, { components: [] }))
      }
      return null
    }
  }
}
