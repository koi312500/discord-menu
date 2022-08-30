import {
  ActionRowBuilder,
  AwaitMessageCollectorOptionsParams,
  ButtonInteraction,
  CommandInteraction,
  ComponentType,
  InteractionReplyOptions,
  MessageActionRowComponentBuilder,
  SelectMenuInteraction,
} from "discord.js"
import { AfterReact } from "../types"

export abstract class DiscordMenu {
  components: ActionRowBuilder<MessageActionRowComponentBuilder>[] = []
  filter:
    | (
        | AwaitMessageCollectorOptionsParams<ComponentType.Button>["filter"]
        | AwaitMessageCollectorOptionsParams<ComponentType.SelectMenu>["filter"]
      )
    | undefined
  afterReact: AfterReact = AfterReact.ResetComponents

  // milliseconds
  timeout: number = 15000

  setAfterReact(afterReact: AfterReact) {
    this.afterReact = afterReact
  }

  /**
   * Sets the timeout for waiting for component interactions.
   * @param timeout - The timeout in milliseconds (default: 15000)
   */
  setTimeout(timeout: number) {
    if (timeout <= 0) throw new Error("Not a valid timeout")
    this.timeout = timeout
  }

  setFilter(
    filter:
      | AwaitMessageCollectorOptionsParams<ComponentType.Button>["filter"]
      | AwaitMessageCollectorOptionsParams<ComponentType.SelectMenu>["filter"]
  ) {
    this.filter = filter
  }

  async awaitFor(
    i: CommandInteraction,
    options: InteractionReplyOptions
  ): Promise<SelectMenuInteraction | ButtonInteraction | void> {
    return
  }
}
