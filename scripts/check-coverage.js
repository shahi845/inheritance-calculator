import fs from 'fs';
import path from 'path';

// Define the tests directory
const testsDir = path.join(process.cwd(), 'src', 'tests');

// Helper to recursively find all .test.js or .js test files
function findTestFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findTestFiles(filePath, fileList);
        } else if (file.endsWith('.test.js') || file.endsWith('QuestionBank.js') || file.endsWith('SampleCases.js')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

// Helper to extract all imported local paths from a file
function getImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const imports = [];
    // Match import ... from '...'
    const regex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const importPath = match[1];
        if (importPath.startsWith('.')) {
            // resolve relative path
            let resolved = path.resolve(path.dirname(filePath), importPath);
            if (!resolved.endsWith('.js')) resolved += '.js';
            imports.push(resolved);
        }
    }
    return imports;
}

// Find all test files
const allFiles = findTestFiles(testsDir);
const entryPoint = path.join(testsDir, 'runner', 'runAllTests.js');

// Trace imports starting from entryPoint
const visited = new Set();
function traceImports(currentFile) {
    if (!fs.existsSync(currentFile) || visited.has(currentFile)) return;
    visited.add(currentFile);
    
    // Only trace inside src/tests
    if (!currentFile.startsWith(testsDir)) return;
    
    const imports = getImports(currentFile);
    for (const imp of imports) {
        traceImports(imp);
    }
}

traceImports(entryPoint);

// Find orphaned files
const orphaned = allFiles.filter(f => !visited.has(f) && !f.includes('runTests') && !f.includes('runNode') && !f.includes('runBrowser') && !f.includes('runBenchmark') && !f.includes('browserAutoTester'));

console.log(`Found ${allFiles.length} test-related files.`);
console.log(`Found ${visited.size} files connected to runAllTests.js.`);

if (orphaned.length > 0) {
    console.error(`\n❌ Found ${orphaned.length} orphaned test files that are NOT imported by the main runner:`);
    orphaned.forEach(f => console.error(`  - ${path.relative(process.cwd(), f)}`));
    process.exit(1);
} else {
    console.log('\n✅ All test files are properly connected to the main runner.');
    process.exit(0);
}
