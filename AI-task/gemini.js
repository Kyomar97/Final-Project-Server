const axios = require("axios");

const GEMINI_API_URL = process.env.GEMINI_API_URL; // URL Gemini IA

/**
 * Sugerir actividades en los proyectos en Gemini AI.
 * @param {string} context
 * @returns {Promise<Array<string>>}
 */
const suggestTasks = async (descripcion) => {
  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [{ text: "Dime 5 palabras" }],
        },
      ],
    });
    console.log(response.data);

    const tasks = response.data.candidates[0].content.parts[0].text;
    return tasks;
  } catch (error) {
    console.error("Error suggesting tasks:", error);
    throw new Error("Could not fetch task suggestions from Gemini AI.");
  }
};

module.exports = {
  suggestTasks,
};
