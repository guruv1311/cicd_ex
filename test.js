// Simple test file for CI/CD pipeline
console.log('🧪 Running tests...\n');

// Test 1: Check if files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = ['index.html', 'styles.css', 'script.js'];
let allTestsPassed = true;

console.log('Test Suite: File Validation');
console.log('============================\n');

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ PASS: ${file} exists`);
    } else {
        console.log(`❌ FAIL: ${file} not found`);
        allTestsPassed = false;
    }
});

console.log('\n');

// Test 2: Check file sizes
console.log('Test Suite: File Size Validation');
console.log('==================================\n');

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);

        if (stats.size > 0) {
            console.log(`✅ PASS: ${file} has content (${sizeKB} KB)`);
        } else {
            console.log(`❌ FAIL: ${file} is empty`);
            allTestsPassed = false;
        }
    }
});

console.log('\n');

// Test 3: Validate HTML structure
console.log('Test Suite: HTML Structure Validation');
console.log('======================================\n');

const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const htmlTests = [
    { name: 'DOCTYPE declaration', pattern: /<!DOCTYPE html>/i },
    { name: 'HTML tag', pattern: /<html/i },
    { name: 'Head section', pattern: /<head>/i },
    { name: 'Body section', pattern: /<body>/i },
    { name: 'Title tag', pattern: /<title>/i },
    { name: 'CSS link', pattern: /<link.*href="styles\.css"/i },
    { name: 'JavaScript link', pattern: /<script.*src="script\.js"/i }
];

htmlTests.forEach(test => {
    if (test.pattern.test(htmlContent)) {
        console.log(`✅ PASS: ${test.name} found`);
    } else {
        console.log(`❌ FAIL: ${test.name} not found`);
        allTestsPassed = false;
    }
});

console.log('\n');

// Test 4: Validate CSS
console.log('Test Suite: CSS Validation');
console.log('===========================\n');

const cssContent = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');

const cssTests = [
    { name: 'CSS variables defined', pattern: /:root\s*{/ },
    { name: 'Responsive design', pattern: /@media/ },
    { name: 'Animations defined', pattern: /@keyframes/ }
];

cssTests.forEach(test => {
    if (test.pattern.test(cssContent)) {
        console.log(`✅ PASS: ${test.name}`);
    } else {
        console.log(`⚠️  WARN: ${test.name} not found`);
    }
});

console.log('\n');

// Test 5: Validate JavaScript
console.log('Test Suite: JavaScript Validation');
console.log('==================================\n');

const jsContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

const jsTests = [
    { name: 'Event listeners', pattern: /addEventListener/ },
    { name: 'DOM manipulation', pattern: /querySelector/ },
    { name: 'Functions defined', pattern: /function\s+\w+\s*\(/ }
];

jsTests.forEach(test => {
    if (test.pattern.test(jsContent)) {
        console.log(`✅ PASS: ${test.name}`);
    } else {
        console.log(`⚠️  WARN: ${test.name} not found`);
    }
});

console.log('\n');

// Final results
console.log('Test Results');
console.log('============\n');

if (allTestsPassed) {
    console.log('✅ All tests passed!\n');
    process.exit(0);
} else {
    console.log('❌ Some tests failed!\n');
    process.exit(1);
}
