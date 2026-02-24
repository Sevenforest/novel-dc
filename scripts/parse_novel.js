import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../src/data/merged_novel.txt');
const outputDir = path.join(__dirname, '../src/data/chapters');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const text = fs.readFileSync(inputPath, 'utf-8');
const lines = text.split(/\r?\n/);

let chapters = [];
let currentChapter = null;
let chapterCounter = 0;

// Context for inferring speakers
let lastSpeaker = "カイ";
let previousSpeaker = "ミオ";

// Helper to deduce speaker
function inferSpeaker(dialogue, context) {
    // Very naive alternating logic for カイ and ミオ which seem to be the main characters
    // If the last speaker was カイ, maybe this one is ミオ, and vice versa.
    if (lastSpeaker === "カイ") {
        previousSpeaker = "カイ";
        lastSpeaker = "ミオ";
        return "ミオ";
    } else {
        previousSpeaker = "ミオ";
        lastSpeaker = "カイ";
        return "カイ";
    }
}

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Detect Chapter Headings (e.g., 第１話（序章）：連続性の終焉)
    if (line.match(/^第[０-９0-9一二三四五六七八九十百]+話/)) {
        if (currentChapter && currentChapter.data.length > 0) {
            chapters.push(currentChapter);
        }
        chapterCounter++;

        // For indexing, we'll keep the chapterId simple
        let chapterId = `chapter${chapterCounter}`;
        currentChapter = {
            id: chapterId,
            title: line,
            data: [
                { speaker: "SYSTEM", text: `--- ${line} ---`, glitch: true } // Chapter start banner
            ]
        };

        // reset context
        lastSpeaker = "カイ";
        previousSpeaker = "ミオ";

        continue;
    }

    // Skip metadata lines like timestamp, author note etc at the start
    if (chapterCounter === 0) continue;
    if (line.match(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}/)) continue;
    if (line.includes("*****************")) continue;

    const isDialogue = line.startsWith('「') && line.endsWith('」');
    const isThought = line.startsWith('（') && line.endsWith('）');

    if (isDialogue) {
        let speaker = "???";

        // Simple inferences based on character ticks
        if (line.includes("カイ君")) speaker = "ミオ";
        else if (line.includes("ミオか")) speaker = "カイ";
        else if (line.includes("ミオ。")) speaker = "カイ";
        else if (line.includes("ミオ、")) speaker = "カイ";
        else {
            // Fallback alternating inference
            speaker = inferSpeaker(line, lines.slice(Math.max(0, i - 5), i).join(''));
        }

        currentChapter.data.push({ speaker, text: line });
    } else if (isThought) {
        // Thoughts usually belong to カイ (the narrator)
        currentChapter.data.push({ speaker: "カイ", text: line });
        lastSpeaker = "カイ";
    } else {
        // Narration
        currentChapter.data.push({ speaker: "カイ", text: line });
    }
}

if (currentChapter && currentChapter.data.length > 0) {
    chapters.push(currentChapter);
}

// Link chapters to each other
for (let i = 0; i < chapters.length; i++) {
    if (i < chapters.length - 1) {
        // Add an empty block to transition to next chapter
        chapters[i].data.push({
            speaker: "SYSTEM",
            text: ">>> NEXT CHAPTER",
            nextChapter: chapters[i + 1].id
        });
    } else {
        // Last chapter goes to ending
        chapters[i].data.push({
            speaker: "SYSTEM",
            text: "--- END OF RECORD ---",
            triggerAction: "go_to_ending"
        });
    }
}

// Write JSON files
chapters.forEach(ch => {
    const filePath = path.join(outputDir, `${ch.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(ch.data, null, 2), 'utf-8');
});

// Create index.js to export all chapters easily
const indexLines = [
    "// Auto-generated chapter index",
];
const exportLines = ["export const CHAPTERS = {"];

chapters.forEach(ch => {
    indexLines.push(`import ${ch.id} from './${ch.id}.json';`);
    exportLines.push(`  ${ch.id},`);
});
exportLines.push("};");
exportLines.push("export const INITIAL_CHAPTER = 'chapter1';");

fs.writeFileSync(path.join(outputDir, 'index.js'), indexLines.join('\n') + '\n\n' + exportLines.join('\n') + '\n', 'utf-8');

console.log(`Successfully generated ${chapters.length} chapters.`);
