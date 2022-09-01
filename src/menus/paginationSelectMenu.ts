import {
  ActionRowBuilder,
  APISelectMenuOption,
  AwaitMessageCollectorOptionsParams,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  ComponentEmojiResolvable,
  ComponentType,
  InteractionReplyOptions,
  InteractionUpdateOptions,
  Message,
  MessageActionRowComponentBuilder,
  SelectMenuInteraction,
} from "discord.js"
import { SelectMenu } from "./selectMenu"
import { AfterReact, CustomId } from "../types"

export class PaginationSelectMenu extends SelectMenu {
  filter_:
    | AwaitMessageCollectorOptionsParams<ComponentType.Button>["filter"]
    | undefined

  constructor() {
    super()
    this.previousButton = new ButtonBuilder()
      .setLabel("Previous")
      .setCustomId(CustomId.PaginationPreviousButton)
      .setStyle(ButtonStyle.Primary)
    this.nextButton = new ButtonBuilder()
      .setLabel("Next")
      .setCustomId(CustomId.PaginationNextButton)
      .setStyle(ButtonStyle.Primary)
    this.pageButton = new ButtonBuilder()
      .setCustomId(CustomId.PaginationPageButton)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
    this.updatePageButton()
  }

  setFilter(
    filter: AwaitMessageCollectorOptionsParams<ComponentType.Button>["filter"]
  ) {
    this.filter_ = filter
    return this
  }

  pageButton: ButtonBuilder
  previousButton: ButtonBuilder
  nextButton: ButtonBuilder

  pageSize = 25
  page = 0
  message: Message | undefined

  setPreviousButtonLabel(label: string) {
    this.previousButton.setLabel(label)
    return this
  }

  setPreviousButtonEmoji(emoji: ComponentEmojiResolvable) {
    this.previousButton.setEmoji(emoji)
    return this
  }

  setNextButtonLabel(label: string) {
    this.nextButton.setLabel(label)
    return this
  }

  setNextButtonEmoji(emoji: ComponentEmojiResolvable) {
    this.nextButton.setEmoji(emoji)
    return this
  }

  isPreviousButtonDisabled() {
    return this.page <= 0
  }

  isNextButtonDisabled() {
    return this.page === this.getPageLength() - 1
  }

  getPageOptions(page: number) {
    return this.options.slice(page * this.pageSize, (page + 1) * this.pageSize)
  }

  getPageLength() {
    return Math.ceil(this.options.length / this.pageSize)
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize
    return this
  }

  private updatePageButton() {
    this.pageButton.setLabel(`${this.page + 1} / ${this.getPageLength()}`)
  }

  async awaitFor(
    i: CommandInteraction,
    options: InteractionReplyOptions
  ): Promise<SelectMenuInteraction | void> {
    this.select.setOptions(this.getPageOptions(this.page))

    this.previousButton.setDisabled(this.isPreviousButtonDisabled())
    this.nextButton.setDisabled(this.isNextButtonDisabled())
    this.updatePageButton()

    const replied = i.deferred || i.replied

    options.components = options.components ? options.components : []
    await (replied ? i.editReply.bind(i) : i.reply.bind(i))({
      ...options,
      components: [
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          this.select
        ),
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
          this.previousButton,
          this.pageButton,
          this.nextButton,
        ]),
        ...options.components,
      ],
    })

    this.message = await i.fetchReply()

    const filter = (i: ButtonInteraction) => {
      return (
        [
          CustomId.PaginationPreviousButton,
          CustomId.PaginationNextButton,
          // @ts-ignore
        ].includes(i.customId) && (this.filter_ ? this.filter_(i) : true)
      )
    }

    while (true) {
      const resI = await this.message
        .awaitMessageComponent({
          filter,
          time: this.timeout,
          componentType: ComponentType.Button,
        })
        .catch((e) => {
          if (
            e.message === "InteractionCollectorError" ||
            e.code === "InteractionCollectorError"
          )
            return
          // throw e
        })

      if (!resI) {
        // Interaction Timeout
        switch (this.afterReact) {
          case AfterReact.ResetComponents:
            await i.editReply(options)
            break

          case AfterReact.DisableComponents:
            await i.editReply(options)
            break

          case AfterReact.ResetAllComponents:
            await i.editReply({ ...options, components: [] })
            break

          case AfterReact.DisableAllComponents:
            await i.editReply({ ...options, components: [] })
            break
        }
        return
      }

      if (resI.customId === CustomId.PaginationPreviousButton) this.page--
      if (resI.customId === CustomId.PaginationNextButton) this.page++

      this.select.setOptions(this.getPageOptions(this.page))

      this.previousButton.setDisabled(this.isPreviousButtonDisabled())
      this.nextButton.setDisabled(this.isNextButtonDisabled())
      this.updatePageButton()
      const _options = Object.assign(options, {
        components: [
          new ActionRowBuilder().addComponents(this.select),
          new ActionRowBuilder().addComponents([
            this.previousButton,
            this.pageButton,
            this.nextButton,
          ]),
        ],
      })

      await resI.update(_options as InteractionUpdateOptions)
    }
  }
}
