const Groq = require('groq-sdk');
const dotenv = require('dotenv');
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GenerateAiData = async (message) => {

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const text = completion.choices[0].message.content;
    
    // Clean the response text (strip out any unwanted code block formatting, if any)
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    // Parse the cleaned text into JSON
    const result = JSON.parse(cleanedText);
  
    return result;
  } catch (error) {
    console.error(error);
    return null
  }
}

module.exports = { GenerateAiData };
