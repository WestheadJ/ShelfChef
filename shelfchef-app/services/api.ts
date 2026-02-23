import { IP } from "@/constants/constant";
export async function parseRecipeOCR(ocrText: string) {

    const res = await fetch(`http://${IP.address}:${IP.port}/parse-recipe`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ocrText })
    });

    if (!res.ok) throw new Error("Recipe parse failed");

    return res.json();
}
