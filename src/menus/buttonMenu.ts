import { DiscordMenu } from "./menu"
import {
  AwaitMessageCollectorOptionsParams,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  InteractionReplyOptions,
} from "discord.js"
import { AfterReact } from "../types"

export abstract class ButtonMenu extends DiscordMenu {
  filter:
    | AwaitMessageCollectorOptionsParams<ComponentType.Button>["filter"]
    | undefined

  async awaitFor(
    i: CommandInteraction,
    options: InteractionReplyOptions
  ): Promise<ButtonInteraction | void> {
    options.components = options.components ? options.components : []
    const message = await (i.replied || i.deferred
      ? i.editReply
      : i.reply
    ).call(i, {
      ...options,
      components: [...this.components, ...options.components],
    })

    while (true) {
      const resI = await message
        .awaitMessageComponent({
          time: this.timeout,
          componentType: ComponentType.Button,
          ...(this.filter ? { filter: this.filter } : {}),
        })
        .catch((e) => {
          if (e.message === "InteractionCollectorError") return
          throw e
        })

      if (this.afterReact === AfterReact.LoopForTimeout) continue
      await resI?.deferUpdate()

      switch (this.afterReact) {
        case AfterReact.ResetComponents:
          await i.editReply(options)
          break

        case AfterReact.DisableComponents:
          await i.editReply(options)
      }

      return resI
    }
  }
}
