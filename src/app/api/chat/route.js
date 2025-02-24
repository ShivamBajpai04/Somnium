import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/api/generate",
      {
        model: "deepseek-r1:7b",
        prompt: message,
        stream: true,
      },
      {
        responseType: "stream",
      }
    );

    const encoder = new TextEncoder();
    let accumulatedResponse = "";
    let chunkCount = 0;

    const stream = new ReadableStream({
      async start(controller) {
        response.data.on("data", (chunk) => {
          try {
            const text = chunk.toString();

            const lines = text.split("\n");

            for (const line of lines) {
              if (!line.trim()) continue;

              try {
                const json = JSON.parse(line);

                if (json.response) {
                  const newToken = json.response;
                  if (!accumulatedResponse.endsWith(newToken)) {
                    accumulatedResponse += newToken;
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ content: newToken })}\n\n`
                      )
                    );
                  }
                }
              } catch (e) {
                console.error("Error parsing line:", line, e);
              }
            }
          } catch (e) {
            console.error("Error processing chunk:", e);
          }
        });

        response.data.on("end", () => {
          controller.close();
        });

        response.data.on("error", (error) => {
          console.error("Stream error:", error);
          controller.error(error);
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chat response" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
