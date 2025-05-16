import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

// ⬇️ EDIT these three
const owner = "shuaiyuu";          // GitHub login
const repo  = "shuaiyuu.github.io";     // repo that has GitHub Pages
const ISSUE = 3;                         // number of __VOTES__ issue

export default async function handler(req, res) {
  try {
    const { key, delta } =
      req.method === "GET" ? { key: req.query.key } : req.body;
    if (!key) return res.status(400).json({ error: "key missing" });

    // read
    const iss = await octokit.rest.issues.get({ owner, repo, issue_number: ISSUE });
    const data = JSON.parse(iss.data.body || "{}");

    // write
    if (req.method === "POST") {
      data[key] = (data[key] || 0) + Number(delta || 0);
      await octokit.rest.issues.update({
        owner, repo, issue_number: ISSUE,
        body: JSON.stringify(data)
      });
    }

    return res.status(200).json({ count: data[key] || 0 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
}
