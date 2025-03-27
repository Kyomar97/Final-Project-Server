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
          parts: [
            {
              text: "Sugiere 5 actividades que pueda realizar en el proyecto un voluntario de una ONG, una por línea, separadas por saltos de línea:\n\n1. [Actividad 1]\n2. [Actividad 2]\n3. [Actividad 3]\n4. [Actividad 4]\n5. [Actividad 5]",
            },
          ],
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
