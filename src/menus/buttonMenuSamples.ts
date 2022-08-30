import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
} from "discord.js"
import { ButtonMenu } from "./buttonMenu"
import { CustomId } from "../types"

export class YesNoMenu extends ButtonMenu {
  yesButton: ButtonBuilder
  noButton: ButtonBuilder

  constructor() {
    super()
    this.yesButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId(CustomId.YesButton)
      .setLabel("Yes")
    this.noButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setCustomId(CustomId.NoButton)
      .setLabel("No")

    this.components.push(
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([
        this.yesButton,
        this.noButton,
      ])
    )
  }
}

export class RetryCancelMenu extends ButtonMenu {
  retryButton: ButtonBuilder
  cancelButton: ButtonBuilder

  // private static defaultRetryText?: string

  constructor() {
    super()
    this.retryButton = new ButtonBuilder()
      .setEmoji("🔄")
      .setStyle(ButtonStyle.Primary)
      .setCustomId(CustomId.RetryButton)
      .setLabel("Retry")
    this.cancelButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(CustomId.CancelButton)
      .setLabel("Cancel")

    this.components.push(
      new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(
        this.retryButton,
        this.cancelButton
      )
    )
  }

  setRetryText(label: string): this {
    this.retryButton.setLabel(label)
    return this
  }

  setCancelText(label: string): this {
    this.cancelButton.setLabel(label)
    return this
  }
}

export class OKCancelMenu extends ButtonMenu {
  okButton: ButtonBuilder
  cancelButton: ButtonBuilder

  constructor() {
    super()
    this.okButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId(CustomId.OkButton)
      .setLabel("OK")
    this.cancelButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(CustomId.CancelButton)
      .setLabel("Cancel")

    this.components.push(
      new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(
        this.okButton,
        this.cancelButton
      )
    )
  }

  setOkText(label: string): this {
    this.okButton.setLabel(label)
    return this
  }

  setCancelText(label: string): this {
    this.cancelButton.setLabel(label)
    return this
  }
}

export class YesNoCancelMenu extends ButtonMenu {
  yesButton: ButtonBuilder
  noButton: ButtonBuilder
  cancelButton: ButtonBuilder

  constructor() {
    super()
    this.yesButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId(CustomId.YesButton)
      .setLabel("Yes")
    this.noButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setCustomId(CustomId.NoButton)
      .setLabel("No")
    this.cancelButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(CustomId.CancelButton)
      .setLabel("Cancel")

    this.components.push(
      new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(
        this.yesButton,
        this.noButton,
        this.cancelButton
      )
    )
  }

  setYesText(label: string): this {
    this.yesButton.setLabel(label)
    return this
  }

  setNoText(label: string): this {
    this.noButton.setLabel(label)
    return this
  }

  setCancelText(label: string): this {
    this.cancelButton.setLabel(label)
    return this
  }
}
