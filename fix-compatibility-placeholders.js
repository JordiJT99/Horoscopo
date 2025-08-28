const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

// Obtener todos los archivos JSON en el directorio locales
const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));

let totalCorrections = 0;

files.forEach(file => {
    const filePath = path.join(localesDir, file);
    
    try {
        // Leer el contenido del archivo
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Corregir placeholders inconsistentes en CompatibilitySection
        content = content.replace(
            /"CompatibilitySection\.reportTitle":\s*"([^"]*\{)signName(\}[^"]*\{)sign2(\}[^"]*)"/g,
            '"CompatibilitySection.reportTitle": "$1sign1$2sign2$3"'
        );
        
        content = content.replace(
            /"CompatibilitySection\.reportTitle\.friendship":\s*"([^"]*\{)signName(\}[^"]*\{)sign2(\}[^"]*)"/g,
            '"CompatibilitySection.reportTitle.friendship": "$1sign1$2sign2$3"'
        );
        
        content = content.replace(
            /"CompatibilitySection\.reportTitle\.work":\s*"([^"]*\{)signName(\}[^"]*\{)sign2(\}[^"]*)"/g,
            '"CompatibilitySection.reportTitle.work": "$1sign1$2sign2$3"'
        );
        
        // Contar correcciones si hubo cambios
        if (content !== originalContent) {
            const corrections = (originalContent.match(/\{signName\}/g) || []).length;
            totalCorrections += corrections;
            console.log(`${file}: ${corrections} placeholders corregidos`);
        }
        
        // Escribir el contenido corregido de vuelta al archivo
        fs.writeFileSync(filePath, content, 'utf8');
        
    } catch (error) {
        console.error(`Error procesando ${file}:`, error.message);
    }
});

console.log(`\nTotal de correcciones de placeholders: ${totalCorrections}`);
