/**
 * Extract a balanced { ... } block from text (first occurrence).
 * Then sanitize string values (escape raw newlines/tabs) so JSON.parse works.
 * Returns parsed object or null if parsing fails.
 *
 * This function handles common AI model output issues:
 * - Markdown code blocks (```json ... ```)
 * - Unescaped newlines and tabs in strings
 * - Nested JSON objects
 * - Trailing text after valid JSON
 */
export function extractJsonFromModel(text: any) {
  if (!text || typeof text !== "string") {
    console.error("❌ extractJsonFromModel: Invalid input - not a string");
    return null;
  }

  // 1) Remove common markdown fences around JSON (```json ... ``` or ``` ... ```)
  const withoutFences = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();

  // 2) Find first '{' and then find its matching closing '}' using a stack counter.
  const firstOpen = withoutFences.indexOf("{");
  if (firstOpen === -1) return null;

  let i = firstOpen;
  let depth = 0;
  let inString = false;
  let escaped = false;
  let jsonCandidate = null;

  for (; i < withoutFences.length; i++) {
    const ch = withoutFences[i];

    if (ch === '"' && !escaped) {
      inString = !inString;
    }

    if (!inString) {
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
      // when depth falls to 0 we've closed the first object
      if (depth === 0) {
        jsonCandidate = withoutFences.slice(firstOpen, i + 1);
        break;
      }
    }

    // handle escape char for string mode
    if (ch === "\\" && !escaped) escaped = true;
    else escaped = false;
  }

  if (!jsonCandidate) return null;

  // 3) Sanitize raw newlines/tabs inside string literals.
  // Walk through jsonCandidate and replace unescaped newline (\n) and tab (\t) characters
  // that are inside double-quoted strings with their escaped forms.
  let out = "";
  inString = false;
  escaped = false;
  for (let j = 0; j < jsonCandidate.length; j++) {
    const ch = jsonCandidate[j];

    if (ch === '"' && !escaped) {
      inString = !inString;
      out += ch;
      continue;
    }

    if (inString) {
      if (ch === "\n") {
        out += "\\n";
        escaped = false;
        continue;
      }
      if (ch === "\r") {
        // normalize CRLF -> \n
        out += "\\n";
        escaped = false;
        continue;
      }
      if (ch === "\t") {
        out += "\\t";
        escaped = false;
        continue;
      }
      if (ch === "\\" && !escaped) {
        // pass the backslash and mark escape for next char
        out += ch;
        escaped = true;
        continue;
      }
      // if previous char was a backslash, we consumed it; reset escaped
      if (escaped) {
        out += ch;
        escaped = false;
        continue;
      }
      // normal char inside string
      out += ch;
    } else {
      // outside string, just copy
      out += ch;
    }
  }

  // 4) Try JSON.parse
  try {
    const parsed = JSON.parse(out);
    console.log("✅ JSON parsed successfully");

    // Validate it's an object
    if (typeof parsed !== 'object' || parsed === null) {
      console.error("❌ Parsed result is not a valid object");
      return null;
    }

    return parsed;
  } catch (err: any) {
    console.error("❌ JSON.parse failed:", err.message);
    console.error("Failed JSON string (first 500 chars):", out.substring(0, 500));

    // parsing failed even after sanitization
    // As a last-ditch attempt, try to extract subject/body via regex pairs
    // (This is a legacy fallback for email-style responses)
    const subjectMatch =
      out.match(/"subject"\s*:\s*"([\s\S]*?)"\s*(,|\})/i) ||
      out.match(/subject\s*:\s*"([\s\S]*?)"\s*(,|\})/i);
    const bodyMatch =
      out.match(/"body"\s*:\s*"([\s\S]*?)"\s*(,|\})/i) ||
      out.match(/body\s*:\s*"([\s\S]*?)"\s*(,|\})/i);

    if (subjectMatch || bodyMatch) {
      const decode = (s: any) =>
        s
          ? s
              .replace(/\\n\\n/g, "") // if model used double newline, keep extra spacing
              .replace(/\\n/g, "")    // every newline → 2 real line breaks
              .replace(/\\t/g, "\t")
              .replace(/\\"/g, '')
              .trim()
          : null;

      console.log("⚠️ Using fallback subject/body extraction");
      return {
        subject: subjectMatch ? decode(subjectMatch[1]) : null,
        body: bodyMatch ? decode(bodyMatch[1]) : null,
      };
    }

    console.error("❌ All JSON extraction methods failed");
    return null;
  }
}

/* Example usage inside your generateInternshipEmail function:

const rawText = response?.choices?.[0]?.message?.content?.trim() ||
                response?.choices?.[0]?.message?.reasoning?.trim() || "";

const parsed = extractJsonFromModel(rawText);

if (parsed && (parsed.subject || parsed.body)) {
  // sanitize and return
  return {
    subject: (parsed.subject || "Internship Application").trim(),
    body:
      (parsed.body || "Hi, I'm interested in an internship.").replace(/\\n/g, "\n").trim(),
  };
}

// fallback: try to parse "Subject:" and "Body:" style plain text
// ... your existing fallback logic ...
*/

