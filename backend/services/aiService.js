import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GROQ_API_KEY || '';
const groq = apiKey ? new Groq({ apiKey }) : null;

const CATEGORIES = [
  'Drinking Water',
  'Roads & Transport',
  'Electricity & Power',
  'Sanitation & Waste',
  'Healthcare',
  'Education',
  'Agriculture & Irrigation',
  'Environment & Forest',
  'Public Safety',
  'Other'
];

// Active models (ensure you use a model that supports vision/multimodal input if passing images)
const TARGET_MODELS = [
  'llama-3.2-90b-vision-preview', // Or your preferred Groq vision model
  'openai/gpt-oss-120b',
  'groq/compound',
  'qwen/qwen3.6-27b'
];

export const analyzeProblemWithAI = async (description, imageBuffer, mimeType) => {
  if (groq && apiKey.startsWith('gsk_')) {
    for (const modelName of TARGET_MODELS) {
      try {
        console.log(`[AI Service] Attempting classification via Groq model: ${modelName}...`);

        // Construct user message payload
        let userContent = [
          { 
            type: 'text', 
            text: `Analyze this civic problem report: "${description}". Return a JSON object with keys: title (string), category (strictly one of ${JSON.stringify(CATEGORIES)}), severity ("Low", "Medium", "High", "Critical"), tags (array of strings), summary (1 sentence string).` 
          }
        ];

        // Attach image to payload if provided
        if (imageBuffer && mimeType) {
          const base64Image = imageBuffer.toString('base64');
          userContent.push({
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`
            }
          });
        }

        const completion = await groq.chat.completions.create({
          messages: [
            { 
              role: 'system', 
              content: 'You are an assistant that outputs strictly raw JSON matching the exact schema requested without any markdown or formatting.' 
            },
            { 
              role: 'user', 
              content: userContent 
            }
          ],
          model: modelName,
          temperature: 0.1
        });

        const rawText = completion.choices[0].message.content.trim();
        const jsonText = rawText.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
        
        const parsedData = JSON.parse(jsonText);

        console.log(`--- GROQ AI SUCCESS (${modelName}) ---`);
        console.log(parsedData);
        console.log('------------------------------------');
        return parsedData;

      } catch (err) {
        console.warn(`[AI Service] Model ${modelName} failed: ${err.message}`);
      }
    }
  }

  // Local fallback parser if API requests fail
  console.log('[AI Service] Processing report using built-in keyword parser...');
  
  const text = (description || '').toLowerCase();
  let category = 'Other';
  let severity = 'Medium';

  if (text.includes('water') || text.includes('pipe') || text.includes('leak')) {
    category = 'Drinking Water';
    severity = 'High';
  } else if (text.includes('road') || text.includes('pothole') || text.includes('traffic')) {
    category = 'Roads & Transport';
    severity = 'High';
  } else if (text.includes('garbage') || text.includes('waste') || text.includes('clean')) {
    category = 'Sanitation & Waste';
    severity = 'Medium';
  } else if (text.includes('wire') || text.includes('electric') || text.includes('light')) {
    category = 'Electricity & Power';
    severity = 'Critical';
  }

  return {
    title: description ? (description.slice(0, 40) + '...') : 'Civic Issue Report',
    category: category,
    severity: severity,
    tags: ['civic-report', category.toLowerCase().replace(/\s+/g, '-')],
    summary: description ? description.slice(0, 100) : 'Civic complaint submitted for manual department review.'
  };
};