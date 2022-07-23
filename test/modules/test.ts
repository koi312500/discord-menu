import { applicationCommand, Extension } from "@pikokr/command.ts"
import { ApplicationCommandType, ChatInputCommandInteraction } from "discord.js"
import {
  OKCancelMenu,
  RetryCancelMenu,
  YesNoCancelMenu,
  YesNoMenu,
} from "../../src"
import { PaginationSelectMenu } from "../../src"

class Test extends Extension {
  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: "yes_no_test",
    description: "test",
    // nameLocalizations: {
    //   ko: "키뮤바보",
    //   "en-US": "kimu",
    // },
  })
  async yesNoTest(i: ChatInputCommandInteraction) {
    const resInteraction = await i.sendMenu({
      content: "와 샌즈",
      menu: new YesNoMenu(),
    })
    if (!resInteraction) return i.editReply({ content: "시간초과예요!" })
    await i.editReply(`${resInteraction.customId}을 누르셨어요!`)
  }

  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: "retry_cancel_test",
    description: "test",
  })
  async retryCancelTest(i: ChatInputCommandInteraction) {
    const resInteraction = await i.sendMenu({
      content: "와 샌즈",
      menu: new RetryCancelMenu(),
    })
    if (!resInteraction) return i.editReply({ content: "시간초과예요!" })
    await i.editReply(`${resInteraction.customId}을 누르셨어요!`)
  }

  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: "ok_cancel_test",
    description: "test",
  })
  async OKCancelTest(i: ChatInputCommandInteraction) {
    const resInteraction = await i.sendMenu({
      content: "와 샌즈",
      menu: new OKCancelMenu(),
    })
    if (!resInteraction) return i.editReply({ content: "시간초과예요!" })
    await i.editReply(`${resInteraction.customId}을 누르셨어요!`)
  }

  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: "yes_no_cancel_test",
    description: "test",
  })
  async YesNoCancelTest(i: ChatInputCommandInteraction) {
    const resInteraction = await i.sendMenu({
      content: "와 샌즈",
      menu: new YesNoCancelMenu(),
    })
    if (!resInteraction) return i.editReply({ content: "시간초과예요!" })
    await i.editReply(`${resInteraction.customId}을 누르셨어요!`)
  }

  @applicationCommand({
    type: ApplicationCommandType.ChatInput,
    name: "pagination_test",
    description: "test",
  })
  async paginationTest(i: ChatInputCommandInteraction) {
    const select = new PaginationSelectMenu()
      .addOptions([
        { label: "청소1", value: "342432" },
        { label: "청소2", value: "3dfdsf42432" },
        { label: "청소3", value: "34dfsdf2432" },
        { label: "청소4", value: "342dsfsf432" },
        { label: "청소5", value: "342sdfsdf432" },
        { label: "청소6", value: "342dsfsdfdsfdsf432" },
        { label: "청소7", value: "342sdfsdfdsfsd432" },
        { label: "청소8", value: "dsfsfsedf" },
        { label: "청소9", value: "342sdfsdfdssddssdssdsfsd432" },
        { label: "청소10", value: "342sdfsefsfesdsddsdsfdsfsd432" },
        { label: "청소11", value: "342sdfsdfdssdfdsfsd432" },
        { label: "청소12", value: "342sdfsdfsddssfdsfsd432" },
        { label: "청소13", value: "342sdfsdsfdsfsd432" },
        { label: "청소14", value: "342sdfsdsdsdfdsfsd432" },
        { label: "청소15", value: "342sdfssdsddfdsfsd432" },
        { label: "청소16", value: "sdddfdsddsfd" },
        { label: "청소17", value: "342sdfssdfdssddfdsfsd432" },
        { label: "청소18", value: "fdfdd" },
        { label: "청소19", value: "342sdfssdfdssdddddfdsfsd4asdf32" },
        { label: "청소20", value: "342sdfssdfdddsddsddfdsfsd4rwer32" },
        {
          label: "청소21",
          value: "342sdfssdfdssdfsfsefsfsdfssddfdfsdfsdfdsfsd432",
        },
        { label: "청소22", value: "342sdfssdfsdfdssddffedsfsd432" },
        { label: "청소23", value: "342sdfssdfsdfdssddfesfefdsfsd432" },
        { label: "청소24", value: "342sdfssdfsdfdssddfdfsefsefdsfsd432" },
      ])
      .setPageSize(5)

    const resInteraction = await i.sendMenu({
      content: "와 샌즈",
      menu: select,
    })
    if (!resInteraction) return i.editReply({ content: "시간초과예요!" })
    if (!resInteraction.isSelectMenu()) return
    await i.editReply(`${resInteraction.values}을 누르셨어요!`)
  }
}

export const setup = () => {
  return new Test()
}
