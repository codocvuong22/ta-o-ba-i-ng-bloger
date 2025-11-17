import { GoogleGenAI, Type, Modality } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface BlogPost {
  title: string;
  content: string;
  imageUrl: string;
}

export const generateBlogPost = async (topic: string): Promise<BlogPost> => {
  try {
    // Step 1: Generate blog post title and content
    const textPrompt = `Dựa trên chủ đề sau: "${topic}", hãy tạo một bài đăng trên blog. Cung cấp một tiêu đề hấp dẫn và nội dung blog chi tiết, được định dạng tốt với các đoạn văn. Trả về kết quả dưới dạng JSON với các khóa 'title' và 'content'.`;
    
    const textResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: textPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Tiêu đề hấp dẫn của bài đăng trên blog.",
            },
            content: {
              type: Type.STRING,
              description: "Nội dung đầy đủ của bài đăng trên blog, được định dạng bằng các đoạn văn.",
            },
          },
          required: ["title", "content"],
        },
      },
    });

    const jsonText = textResponse.text.trim();
    const blogTextData: { title: string; content: string } = JSON.parse(jsonText);

    // Step 2: Generate an image based on the generated title
    const imagePrompt = `Tạo một hình ảnh minh họa cho bài đăng blog có tiêu đề: "${blogTextData.title}". Hình ảnh cần có tính thẩm mỹ cao, phù hợp với chủ đề và hấp dẫn.`;

    const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: imagePrompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
      });

    let imageUrl = '';
    for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          imageUrl = `data:image/png;base64,${base64ImageBytes}`;
          break; 
        }
    }
    
    if (!imageUrl) {
        throw new Error("Không thể tạo hình ảnh minh họa.");
    }

    return {
        ...blogTextData,
        imageUrl: imageUrl,
    };

  } catch (error) {
    console.error("Error generating blog post:", error);
    throw new Error("Không thể tạo bài đăng. Vui lòng thử lại sau.");
  }
};
