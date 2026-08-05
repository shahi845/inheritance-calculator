/**
 * munasakhatInputReader.js — Reads and parses the Munāsakhāt JSON input field.
 */

/**
 * Reads the textarea content and returns a parsed case object.
 * Returns null and displays an error if the JSON is invalid.
 * @returns {object|null} parsed case data or null on error
 */
export function readMunasakhatInput() {
  const textarea = document.getElementById('munasakhatJsonInput');
  if (!textarea) return null;

  const raw = textarea.value.trim();
  if (!raw) {
    return { error: 'No input provided. Please paste a Munāsakhāt case JSON.' };
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    return { error: `Invalid JSON: ${e.message}` };
  }
}
