const API_KEY = process.env.LINEAR_API_KEY;
const API_URL = "https://api.linear.app/graphql";

async function run() {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ query: `query { organization { name } teams { nodes { name } } }` })
  });
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}
run();
