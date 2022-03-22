const inquirer = require("inquirer");
require("colors");

const inquirerMenu = async () => {
  const questionsMenu = [
    {
      type: "list",
      name: "option",
      message: "Select an option",
      choices: [
        { value: 1, name: `${"1.-".green} Search City` },
        { value: 2, name: `${"2.-".green} History` },
        { value: 0, name: `${"0.-".green} Exit` },
      ],
    },
  ];
  console.clear();
  console.log("====================".green);
  console.log("  Choose an option".white);
  console.log("====================\n".green);

  const { option } = await inquirer.prompt(questionsMenu);
  return option;
};

const inquirerPause = async () => {
  const questionPause = [
    {
      type: "input",
      message: `Press ${"ENTER".green} to continue`,
      name: "exit",
    },
  ];
  await inquirer.prompt(questionPause);
  console.log("\n");
};

const inquirerRead = async (message) => {
  const questionRead = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Write a place";
        }
        return true;
      },
    },
  ];
  const { desc } = await inquirer.prompt(questionRead);
  return desc;
};

const inquirerListPlaces = async (places = []) => {
  const choices = places.map((t, i) => {
    return {
      value: t.id,
      name: `${`${i + 1}.`.green} ${t.name}`,
    };
  });

  choices.unshift({
    value: 0,
    name: `${`0`.green} Cancel`,
  });

  const questionPlaces = [
    {
      type: "list",
      message: `Choose a place: `,
      name: "id",
      choices,
    },
  ];
  const { id } = await inquirer.prompt(questionPlaces);
  return id;
};

module.exports = {
  inquirerMenu,
  inquirerPause,
  inquirerRead,
  inquirerListPlaces,
};
