import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, SubjectPerformance } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "O enunciado da questão estilo ENEM." },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5 alternativas de resposta.",
    },
    correctIndex: { type: Type.INTEGER, description: "O índice da resposta correta (0-4)." },
    explanation: { type: Type.STRING, description: "Uma explicação detalhada do porquê a resposta está correta." },
    subject: { type: Type.STRING, description: "A matéria da questão (Matemática, Linguagens, etc)." },
  },
  required: ["text", "options", "correctIndex", "explanation", "subject"],
};

export const generateChallengeQuestion = async (subject: string): Promise<Question> => {
  try {
    const prompt = `Gere uma questão de múltipla escolha desafiadora para estudantes que estão se preparando para o ENEM (Brasil).
    A questão deve ser sobre: ${subject}.
    O estilo deve ser interpretativo e contextualizado, similar às provas recentes do ENEM.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        temperature: 0.7, // Criatividade moderada para questões variadas
      },
    });

    const data = JSON.parse(response.text || "{}");

    return {
      id: `ai-${Date.now()}`,
      source: 'AI_GENERATED',
      year: new Date().getFullYear(),
      text: data.text,
      options: data.options,
      correctIndex: data.correctIndex,
      explanation: data.explanation,
      subject: data.subject
    };

  } catch (error) {
    console.error("Erro ao gerar questão com Gemini:", error);
    // Fallback básico caso a API falhe para não quebrar o app
    return {
      id: 'fallback',
      source: 'AI_GENERATED',
      text: 'Não foi possível gerar uma nova questão online agora. Tente novamente mais tarde.',
      options: ['Erro', 'Erro', 'Erro', 'Erro', 'Erro'],
      correctIndex: 0,
      explanation: 'Verifique sua conexão ou chave de API.',
      subject: 'Sistema'
    };
  }
};

export const generatePerformanceReport = async (stats: SubjectPerformance[]): Promise<string> => {
    try {
        const statsText = stats.map(s => `- ${s.subject}: Acertou ${s.correct} de ${s.total}`).join('\n');
        
        const prompt = `
            Atue como um mentor especialista em ENEM. Analise os seguintes dados de desempenho recente do aluno:
            ${statsText}

            Forneça um relatório curto e direto (formato markdown) contendo:
            1. Pontos Fortes
            2. Pontos a Melhorar
            3. Plano de Estudo prático para a próxima semana focado em subir a nota.
            
            Seja motivador, mas realista. Use emojis.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text || "Não foi possível gerar o relatório.";
    } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        return "Erro ao conectar com a IA Mentora. Tente novamente.";
    }
}
