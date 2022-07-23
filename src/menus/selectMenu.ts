import { DiscordMenu } from "./menu"
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  InteractionReplyOptions,
  Message,
  ComponentType,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
  AwaitMessageCollectorOptionsParams,
  APISelectMenuOption,
  SelectMenuInteraction,
  InteractionUpdateOptions,
} from "discord.js"
import _ from "lodash"

export class SelectMenu extends DiscordMenu {}

export class PaginationSelectMenu extends SelectMenu {
  select = new SelectMenuBuilder()
  options: any = []
  previousButton: ButtonBuilder
  nextButton: ButtonBuilder
  pageButton: ButtonBuilder
  pageSize = 25
  page = 0
  message: Message | undefined

  constructor() {
    super()
    this.previousButton = new ButtonBuilder()
      .setLabel("이전")
      .setCustomId("previous")
      .setStyle(ButtonStyle.Primary)
    this.nextButton = new ButtonBuilder()
      .setLabel("다음")
      .setCustomId("next")
      .setStyle(ButtonStyle.Primary)
    this.pageButton = new ButtonBuilder()
      .setCustomId("page")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
    this.updatePageButton()
  }

  private updatePageButton() {
    this.pageButton.setLabel(`${this.page + 1} / ${this.getPageLength()}`)
  }

  addOptions(options: any) {
    this.options.push(...options)
    return this
  }

  getPageOptions(page: number) {
    return this.options.slice(page * this.pageSize, (page + 1) * this.pageSize)
  }

  getPageLength() {
    return Math.ceil(this.options.length / this.pageSize)
  }

  isPreviousDisabled() {
    return this.page <= 0
  }

  isNextDisabled() {
    return this.page === this.getPageLength() - 1
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize
    return this
  }

  async awaitFor(
    interaction: CommandInteraction,
    options: InteractionReplyOptions
  ): Promise<SelectMenuInteraction | null> {
    this.select = new SelectMenuBuilder()
    this.select
      .setOptions(this.getPageOptions(this.page))
      .setCustomId("selectSelect")

    this.previousButton.setDisabled(this.isPreviousDisabled())
    this.nextButton.setDisabled(this.isNextDisabled())
    this.updatePageButton()
    const _options = {
      ...options,
      components: [
        new ActionRowBuilder().addComponents(this.select),
        new ActionRowBuilder().addComponents([
          this.previousButton,
          this.pageButton,
          this.nextButton,
        ]),
      ],
    }

    const replied = interaction.deferred || interaction.replied

    await (replied
      ? interaction.editReply.bind(interaction)
      : interaction.reply.bind(interaction))(_options as any)

    this.message = await interaction.fetchReply()

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const filter: AwaitMessageCollectorOptionsParams<ComponentType.Button>["filter"] =
        (m) => m.user.id === interaction.user.id

      let ri
      try {
        ri = await this.message.awaitMessageComponent({
          // filter,
          time: 15000,
          // componentType: ComponentType.Button,
        })
      } catch (e) {
        return null
      }

      if (ri.isSelectMenu()) {
        return ri
      }
      if (ri.customId === "next") this.page++
      if (ri.customId === "previous") this.page--

      this.select.setOptions(this.getPageOptions(this.page))

      this.previousButton.setDisabled(this.isPreviousDisabled())
      this.nextButton.setDisabled(this.isNextDisabled())
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

      await ri.update(_options as InteractionUpdateOptions)
    }
  }
}

type PaginationOptions = {
  pageSize: number
}

export const pagination = (
  opt: Partial<PaginationOptions> = {}
): MethodDecorator => {
  return (target, propertyKey, descriptor) => {
    const desc = descriptor as unknown as TypedPropertyDescriptor<
      (...args: unknown[]) => void
    >
    const options = _.merge<Partial<PaginationOptions>, PaginationOptions>(
      opt,
      {
        pageSize: 25,
      }
    )

    const method = descriptor.value! as unknown as (
      ...args: unknown[]
    ) => Promise<SelectMenuOptionBuilder[] | null>

    desc.value = async function () {
      const result = await method()
      if (!result) return
      console.log(result)
    }
  }
}
