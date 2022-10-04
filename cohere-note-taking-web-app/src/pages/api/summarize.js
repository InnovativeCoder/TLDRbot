import axios from "axios";
const cohere = require("cohere-ai");

const handler = async (req, res) => {
  const prompt = `The killer whale or orca (Orcinus orca) is a toothed whale
  belonging to the oceanic dolphin family, of which it is the largest member"
  In summary: "The killer whale or orca is the largest type of dolphin"

  "It is recognizable by its black-and-white patterned body"
  In summary:"Its body has a black and white pattern"

  "Killer whales have a diverse diet, although individual populations often specialize in particular types of prey"`;
  console.log(prompt);
  cohere.init("OUT3PrgQY3ce9r58AGlbOinlfRbVGSCU6Yh3Akht");
  const response = await cohere.generate("large", {
    prompt: prompt,
    stop_sequences: ["."],
    max_tokens: 140,
    temperature: 1,
  });

  console.log(response);
  // if (res.statusCode != 200) {
  //   throw new Error(`${res.statusCode} received from cohere API`);
  // }

  // return res.body.generations[0].text;
  // }
  // res.status(200).json({ name: 'John Doe' })
};
export default handler;
