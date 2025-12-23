import fs from 'fs';
import path from 'path';

// ======= Path Direktori Folder Download =======
const downloadDir = path.resolve('./test/downloads');

// ======= Function Mengkosongkan Folder Download =======
export function clearDownloadFolder() {
    if (fs.existsSync(downloadDir)) {
        fs.rmSync(downloadDir, { recursive: true, force: true });
    }
    fs.mkdirSync(downloadDir);
}
// ======= Function Get CSV Terbaru =======
export async function getLatestDownloadedCsv(prefix, timeout = 10000) {
    await browser.waitUntil(() => {
        const files = fs.readdirSync(downloadDir);
        return files.some(f => f.startsWith(prefix) && f.endsWith('.csv'));
    }, {
        timeout,
        timeoutMsg: `File CSV dengan prefix "${prefix}" belum ditemukan`,
    });

    const files = fs.readdirSync(downloadDir);
    const matchedFiles = files
        .filter(f => f.startsWith(prefix) && f.endsWith('.csv'))
        .map(f => ({
            name: f,
            path: path.join(downloadDir, f),
            mtime: fs.statSync(path.join(downloadDir, f)).mtimeMs
        }));

    const latest = matchedFiles.sort((a, b) => b.mtime - a.mtime)[0];
    return latest;
}