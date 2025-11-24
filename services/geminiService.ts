
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
            3. Dicas rápidas de estudo.
            
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

export const generateAdaptiveStudyPlan = async (subject: string, recentPerformanceContext: string): Promise<string> => {
  try {
    const prompt = `
      Crie um Plano de Estudos Adaptativo de 5 dias focado exclusivamente em: ${subject}.
      
      Contexto do aluno (Erros recentes): ${recentPerformanceContext || "O aluno precisa de uma revisão geral e aprofundada."}
      
      O plano deve ser estruturado em Markdown e conter para cada dia:
      - Tópico Principal (baseado nas fraquezas da área)
      - Resumo Teórico Rápido (1 frase)
      - Sugestão de exercício prático.
      
      No final, inclua uma mensagem motivacional curta.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Erro ao gerar plano de estudos.";
  } catch (error) {
    console.error(error);
    return "Erro de conexão ao gerar plano.";
  }
};

export const correctEssay = async (imageBase64: string, theme: string): Promise<string> => {
  try {
    const prompt = `
      Você é um corretor oficial do ENEM. Corrija a redação presente nesta imagem.
      O tema proposto foi: "${theme}".
      
      Sua saída deve ser estritamente em Markdown seguindo esta estrutura:
      
      # Nota Final: [0 a 1000]
      
      ## Análise por Competência
      1. **Domínio da Escrita Formal:** [Nota 0-200] - [Breve comentário]
      2. **Compreensão do Tema:** [Nota 0-200] - [Breve comentário]
      3. **Organização das Ideias:** [Nota 0-200] - [Breve comentário]
      4. **Coesão e Coerência:** [Nota 0-200] - [Breve comentário]
      5. **Proposta de Intervenção:** [Nota 0-200] - [Breve comentário]
      
      ## Comentários Gerais
      [Sua opinião construtiva sobre o que melhorar e o que explorar mais]
    `;

    // Strip header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use flash for image analysis efficiency
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: prompt }
        ]
      }
    });

    return response.text || "Não foi possível ler a redação. Tente uma foto mais clara.";
  } catch (error) {
    console.error("Erro na correção:", error);
    return "Ocorreu um erro ao processar a imagem da redação. Verifique a qualidade da foto.";
  }
};
