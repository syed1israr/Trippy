import { GoogleGenerativeAI } from "@google/generative-ai";
import asyncHandler from "../utils/asyncHandler .js";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);

const recommendPlaces = asyncHandler(async (req, res) => {
  const { source, budget } = req.body;

  if (!source || !budget) {
    return res.status(400).json({ error: "Source and budget are required" });
  }

  const prompt = `
    Recommend places near "${source}" within a budget of ${budget} rupees. 
    Please respond in the following JSON format:
    
    [
      {
        "place": "Place name",
        "description": "Brief description of the place",
        "transportation": "Transportation options from ${source}"
      },
      ...
    ]
    
    Example:
    
    [
      {
        "place": "Pavana Lake",
        "description": "Enjoy a scenic drive along the scenic Pavana Lake, surrounded by lush greenery. It's a perfect spot for picnics, boating, and a relaxing day out.",
        "transportation": "Public transport: Take a bus from Pune to Lonavala and then an auto to the lake (approx. ₹150-200). Private car: A 30-40 minutes drive."
      },
      {
        "place": "Lonavala",
        "description": "Explore the famous hill station of Lonavala, known for its picturesque beauty and delicious street food.",
        "transportation": "Public transport: Take a bus from Pune to Lonavala (approx. ₹100-150). Private car: A 45-minute to 1 hour drive."
      }
    ]
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

  
    const responseText = result.response.text();

 
    const jsonStart = responseText.indexOf("[");
    const jsonEnd = responseText.lastIndexOf("]") + 1;
    
    const jsonResponse = responseText.slice(jsonStart, jsonEnd);

 
    const places = JSON.parse(jsonResponse);

    return res.status(200).json({
      message: "Places recommended successfully",
      places,
    });
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    return res.status(500).json({ error: "Something went wrong while recommending places" });
  }
});

export { recommendPlaces };
