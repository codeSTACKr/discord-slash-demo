import {
  createSlashCommandHandler,
  ApplicationCommand,
  InteractionHandler,
  Interaction,
  InteractionResponse,
  InteractionResponseType,
  EmbedType,
  ApplicationCommandOptionType,
} from '@glenstack/cf-workers-discord-bot'

const cuteAnimal: ApplicationCommand = {
  name: 'cute-animal-pic',
  description: 'Send an adorable animal photo',
  options: [
    {
      name: 'animal',
      description: 'The type of animal.',
      type: ApplicationCommandOptionType.STRING,
      required: true,
      choices: [
        {
          name: 'Dog',
          value: 'Dog',
        },
        {
          name: 'Cat',
          value: 'Cat',
        },
        {
          name: 'Goat',
          value: 'Goat',
        },
      ],
    },
    {
      name: 'only_baby',
      description: 'Whether to show only baby animals',
      type: ApplicationCommandOptionType.BOOLEAN,
      required: false,
    },
  ],
}

const cuteHandler: InteractionHandler = async (
  interaction: Interaction,
): Promise<InteractionResponse> => {
  const userID = interaction.member.user.id
  const options = interaction.data.options
  const optionType = options && options[0].value
  const optionBaby = (options && options[1] && options[1].value) || false
  const picUrl = getUrl(optionType, optionBaby)

  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Hello, <@${userID}>!`,
      allowed_mentions: {
        users: [userID],
      },
      embeds: [
        {
          title: `Here's a cute ${optionType} picture:`,
          type: EmbedType.rich,
          description: `${optionBaby ? 'Baby ' : ''}${optionType}`,
          color: 11027200,
          image: {
            url: picUrl,
          },
        },
      ],
    },
  }
}

const animalPics = [
  {
    name: 'Dog',
    value:
      'https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_960_720.jpg',
    baby: true,
  },
  {
    name: 'Dog',
    value:
      'https://cdn.pixabay.com/photo/2018/03/31/06/31/dog-3277416_960_720.jpg',
    baby: false,
  },
  {
    name: 'Cat',
    value:
      'https://cdn.pixabay.com/photo/2018/07/13/10/17/cat-3535399_960_720.jpg',
    baby: true,
  },
  {
    name: 'Cat',
    value:
      'https://cdn.pixabay.com/photo/2018/03/26/02/05/cat-3261420_960_720.jpg',
    baby: false,
  },
  {
    name: 'Goat',
    value:
      'https://cdn.pixabay.com/photo/2017/03/18/09/54/goat-2153622_960_720.jpg',
    baby: true,
  },
  {
    name: 'Goat',
    value:
      'https://cdn.pixabay.com/photo/2018/04/17/21/47/nature-3328876_960_720.jpg',
    baby: false,
  },
]

function getUrl(optionType: string, optionBaby: boolean) {
  return animalPics.find(
    (animal) => animal.name === optionType && animal.baby === optionBaby,
  ).value
}

const slashCommandHandler = createSlashCommandHandler({
  applicationID: '807286816532987906',
  applicationSecret: APPLICATION_SECRET, // You should store this in a secret
  publicKey: '62394bf3e9a8572b9aeb302aa7fb315095ec1305c80b9916babd5c2c6e202c44',
  commands: [[cuteAnimal, cuteHandler]],
})

addEventListener('fetch', (event) => {
  event.respondWith(slashCommandHandler(event.request))
})
