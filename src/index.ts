import { loadEnv } from "./env";
import { selectAndHello } from "./provider";

async function main()
{
    loadEnv();
    try{
        const result = await selectAndHello();

        console.log("Result:", result);

        process.stdout.write(`Hello from ${result.provider} using model ${result.model}: ${result.message}\n`);
    }
    catch (error) {

        const message = error instanceof Error ? error.message : String(error);
        console.error("Error:", message);
        process.exit(1);

    }
}

main();