import fs from "fs";
import path from "path";

const API_KEY = process.env.LINEAR_API_KEY;
if (!API_KEY) {
  console.error('❌ Missing LINEAR_API_KEY. Example: export LINEAR_API_KEY="lin_api_..."');
  process.exit(1);
}

const API_URL = "https://api.linear.app/graphql";
const TEAM_NAME = "Majlis Connect";
const TEMPLATES_DIR = "."; // run from docs/linear-templates
const MANAGED_TAG_PREFIX = "managedBy=setup-linear";

const PAGE_SIZE = 50;
const MAX_PAGES = 50;

// -------------------- GraphQL helper --------------------
async function linear(query, variables = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error("❌ Linear API error:", JSON.stringify(json.errors, null, 2));
    process.exit(1);
  }
  return json.data;
}

// -------------------- Markdown helpers --------------------
function parseFrontMatter(md) {
  const m = md.match(/---([\s\S]*?)---/);
  if (!m) return {};
  const obj = {};
  for (const line of m[1].split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const k = trimmed.slice(0, idx).trim();
    const v = trimmed.slice(idx + 1).trim();
    obj[k] = v;
  }
  return obj;
}

function stripFrontMatter(md) {
  return md.replace(/---[\s\S]*?---/, "").trim();
}

function managedTagForFile(file) {
  return `<!-- ${MANAGED_TAG_PREFIX} template=${file} -->`;
}

function ensureManagedTag(description, file) {
  const tag = managedTagForFile(file);
  const desc = description || "";
  if (desc.includes(tag)) return desc;
  return `${tag}\n\n${desc}`;
}

function extractManagedFileFromDescription(description) {
  const re = new RegExp(`<!--\\s*${MANAGED_TAG_PREFIX}\\s+template=([^\\s]+)\\s*-->`);
  const m = (description || "").match(re);
  return m?.[1] || null;
}

// -------------------- Linear helpers --------------------
async function getTeamIdByName(name) {
  const data = await linear(`query { teams { nodes { id name } } }`);
  const team = data.teams.nodes.find((t) => t.name === name);
  if (!team) {
    console.error(`❌ Team "${name}" not found in Linear. Check exact name.`);
    process.exit(1);
  }
  return team.id;
}

async function ensureProject(name, teamId) {
  const data = await linear(`query { projects { nodes { id name } } }`);
  const existing = data.projects.nodes.find((p) => p.name === name);
  if (existing) return existing.id;

  const created = await linear(
    `mutation($name:String!, $teamIds:[String!]!){
      projectCreate(input:{ name:$name, teamIds:$teamIds }){
        project { id }
      }
    }`,
    { name, teamIds: [teamId] }
  );
  return created.projectCreate.project.id;
}

async function ensureLabel(name) {
  const data = await linear(`query { issueLabels { nodes { id name } } }`);
  const existing = data.issueLabels.nodes.find((l) => l.name === name);
  if (existing) return existing.id;

  const created = await linear(
    `mutation($name:String!){
      issueLabelCreate(input:{ name:$name }){
        issueLabel { id }
      }
    }`,
    { name }
  );
  return created.issueLabelCreate.issueLabel.id;
}

async function getUserIdByEmail(email) {
  const data = await linear(`query { users { nodes { id email name } } }`);
  const user = data.users.nodes.find(
    (u) => (u.email || "").toLowerCase() === email.toLowerCase()
  );
  if (!user) {
    console.error(`❌ User not found for email: ${email}`);
    process.exit(1);
  }
  return user.id;
}

async function createIssue(input) {
  const data = await linear(
    `mutation($input:IssueCreateInput!){
      issueCreate(input:$input){
        success
        issue { id title identifier url }
      }
    }`,
    { input }
  );
  return data.issueCreate;
}

async function updateIssue(id, input) {
  const data = await linear(
    `mutation($id:String!, $input:IssueUpdateInput!){
      issueUpdate(id:$id, input:$input){
        success
        issue { id title identifier url }
      }
    }`,
    { id, input }
  );
  return data.issueUpdate;
}

// -------------------- Fetch issues from team --------------------
async function fetchAllTeamIssues(teamId) {
  let cursor = null;
  const all = [];

  for (let page = 0; page < MAX_PAGES; page++) {
    const data = await linear(
      `query($teamId:String!, $after:String, $first:Int!){
        team(id:$teamId){
          issues(first:$first, after:$after, orderBy: updatedAt){
            nodes { id title description updatedAt }
            pageInfo { hasNextPage endCursor }
          }
        }
      }`,
      { teamId, after: cursor, first: PAGE_SIZE }
    );

    all.push(...(data.team.issues.nodes || []));

    const pi = data.team.issues.pageInfo;
    if (!pi.hasNextPage) break;
    cursor = pi.endCursor;
  }

  return all;
}

function buildManagedMap(teamIssues) {
  // file -> newest issue that already has the tag
  const map = new Map();
  for (const issue of teamIssues) {
    const file = extractManagedFileFromDescription(issue.description);
    if (!file) continue;

    const existing = map.get(file);
    if (!existing) map.set(file, issue);
    else {
      const a = new Date(existing.updatedAt).getTime();
      const b = new Date(issue.updatedAt).getTime();
      if (b > a) map.set(file, issue);
    }
  }
  return map;
}

function findNewestByTitle(teamIssues, title) {
  const matches = teamIssues
    .filter((i) => (i.title || "").trim() === title.trim())
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return matches[0] || null;
}

// -------------------- Main --------------------
async function main() {
  console.log("🚀 setup-linear started");
  console.log("PWD:", process.cwd());

  const teamId = await getTeamIdByName(TEAM_NAME);

  const files = fs
    .readdirSync(TEMPLATES_DIR)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");

  console.log("📄 Templates found:", files);

  if (files.length === 0) {
    console.log("ℹ️ No templates found.");
    return;
  }

  // Load all current issues once
  const teamIssues = await fetchAllTeamIssues(teamId);
  const managedMap = buildManagedMap(teamIssues);

  for (const file of files) {
    const raw = fs.readFileSync(path.join(TEMPLATES_DIR, file), "utf8");
    const meta = parseFrontMatter(raw);
    const body = stripFrontMatter(raw);

    const title = body.match(/^#\s+(.*)$/m)?.[1]?.trim() || file.replace(".md", "");
    const description = ensureManagedTag(body, file);

    const labelIds = [];
    if (meta.labels) {
      for (const l of meta.labels.split(",")) {
        const name = l.trim();
        if (!name) continue;
        labelIds.push(await ensureLabel(name));
      }
    }

    const projectId = meta.project ? await ensureProject(meta.project.trim(), teamId) : null;
    const assigneeId = meta.assignee ? await getUserIdByEmail(meta.assignee.trim()) : null;
    const priority = meta.priority ? Number(meta.priority) : 0;

    const payload = {
      teamId,
      title,
      description,
      projectId,
      labelIds,
      assigneeId,
      priority,
    };

    // 1) Prefer exact match by managed tag (true idempotency)
    let existing = managedMap.get(file);

    // 2) If not found, adopt the newest issue with same title (prevents duplicates on fresh setups)
    // This is the key fix for you.
    if (!existing) {
      existing = findNewestByTitle(teamIssues, title);
      if (existing) {
        console.log(`🧲 Adopt by title: "${title}" -> will update ${existing.id}`);
      }
    }

    if (existing) {
      const res = await updateIssue(existing.id, payload);
      console.log(`♻️ Updated: ${file} -> ${res.issue?.identifier || "?"}`);
    } else {
      const res = await createIssue(payload);
      console.log(`✅ Created: ${file} -> ${res.issue?.identifier || "?"}`);
    }
  }

  console.log("🎉 Done (idempotent: tags + title adoption fallback)");
}

main();