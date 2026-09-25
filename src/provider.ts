type Provider = "gemini" | "openai" | "groq";

type HelloOutput = {
  ok:true;
  provider: Provider;
  model: string;
  message: string;
};

type GeminiGenerateContent = { 
    candidates?:Array<{content?:{parts?: Array<{text?:string}>}}>;
}

async function helloGemini(): Promise<HelloOutput> {

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not set in the environment variables.");
    }
    const model = "gemini-2.5-flash-lite";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
           contents: [{
                parts: [{
                    text: "Hello, world!"
                }]
           }]
        }),
    });

    if (!response.ok) {
        throw new Error(`Error calling Gemini API: ${response.status} : ${await response.text()}`);
    }

    const json = await response.json() as GeminiGenerateContent;
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "No content returned";

    return {
        ok: true,
        provider: "gemini",
        model,
        message: text,
    };

}

//GROQ

type OpenAiChatCompletion = {
    choices?: Array<{ message?: { content?: string; }}>;
};

async function helloGroq(): Promise<HelloOutput> {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not set in the environment variables.");
    }

    const model = "llama-3.1-8b-instant";
    const url = `https://api.groq.com/openai/v1/chat/completions`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            messages: [
                   { role: "user", content: "Hello, world!" }             
            ],
            temperature: 0
        }),
    });
    if (!response.ok) {
        throw new Error(`Error calling Groq API: ${response.status} : ${await response.text()}`);
    }

    const json = await response.json() as OpenAiChatCompletion;
    const text = json.choices?.[0]?.message?.content || "No content returned";

    return {
        ok: true,
        provider: "groq",
        model,
        message: text,
    };

}