import axios from "axios";

export const generateCoverLetters = async (req, res) => {
  try {
    const { name, jobTitle, companyName, language, jobDescription } = req.body;

    if (!name || !jobTitle || !companyName || !jobDescription) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Construct the prompt
    const prompt = `
You are an expert career coach and professional writer specialized in writing cover letters that attract recruiters for tech jobs. 

Generate 10 unique, well-formatted, professional cover letters based on the following information:

- Candidate Name: ${name}
- Job Title: ${jobTitle}
- Company Name: ${companyName}
- Language: ${language}
- Job Description / Key Skills: ${jobDescription}

Requirements for the cover letters:

1. Each letter should be unique in wording, structure, and tone while remaining professional.
2. Highlight initiative, problem-solving, adaptability, and relevant technical skills.
3. Include a clear, enthusiastic reason for applying to the company.
4. Well-structured: greeting, short intro, why the candidate is a strong fit, contribution, polite closing.
5. Concise (150–200 words each).
6. Number each letter: Cover Letter 1, Cover Letter 2, etc.
7. Return ONLY a valid JSON object with the following structure:
{
  "letter1": "Full text of first cover letter here",
  "letter2": "Full text of second cover letter here",
  ...
  "letter10": "Full text of tenth cover letter here"
}
8. Do not include any other text, explanations, or formatting outside of this JSON structure.
9. Do NOT include any placeholder text like "[mention a specific project]" or "[Mention a company value]". Instead, create specific, realistic content based on the job title and company name.
10. Do NOT include newline characters (\\n) in the JSON values. Format the letters with proper paragraph breaks as actual newlines.
`;

    // Call Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Extract generated text
    let letters = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    // Try to parse as JSON, if it fails, return as plain text
    try {
      // Remove any markdown code block indicators if present
      letters = letters.replace(/```json/g, '').replace(/```/g, '').trim();
      letters = JSON.parse(letters);
    } catch (parseError) {
      // If parsing fails, return the raw text
      console.log("Failed to parse JSON, returning raw text");
    }

    res.status(200).json({ letters });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate cover letters" });
  }
};