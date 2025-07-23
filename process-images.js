const sharp = require('sharp');
const fs = require('fs');

// Define a pasta de saída principal
const outputDir = 'public/img';

// Garante que a pasta de saída exista
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Pasta '${outputDir}' criada.`);
}

// ===================================================================
// LISTA DE IMAGENS PARA PROCESSAR
// Para adicionar ou mudar uma imagem, basta editar esta lista.
// ===================================================================
const imageTasks = [
    // Hero Banner
    { input: 'fundo-hero.png', output: `${outputDir}/hero-960.webp`, width: 960 },
    { input: 'fundo-hero.png', output: `${outputDir}/hero-1440.webp`, width: 1440 },

    // Logo
    { input: 'logo_simbolo_selma.png', output: `${outputDir}/logo.webp`, width: 180 },
    { input: 'logo_simbolo_selma.png', output: `${outputDir}/logo-45.webp`, width: 45 },

    // Fotos dos Profissionais
    { input: 'fotoandre.jpeg', output: `${outputDir}/fotoandre-142.webp`, width: 142 },
    { input: 'fotoselma.jpeg', output: `${outputDir}/fotoselma-142.webp`, width: 142 },

    // Imagem de Capa (OG Cover)
    { input: 'og-cover.png', output: `${outputDir}/og-cover.webp`, width: 1200, height: 630 }
];

// ===================================================================
// LÓGICA DE PROCESSAMENTO (NÃO PRECISA MUDAR)
// ===================================================================
async function processImage(task) {
    try {
        await sharp(task.input)
            .resize({
                width: task.width,
                height: task.height, // Se a altura não for definida, o sharp mantém a proporção
                fit: 'cover'
            })
            .webp({ quality: 80 }) // Converte para WebP com 80% de qualidade
            .toFile(task.output);
        console.log(`✅ Sucesso: ${task.input} -> ${task.output}`);
    } catch (err) {
        console.error(`❌ Erro ao processar ${task.input}:`, err.message);
    }
}

// Inicia o processamento de todas as imagens da lista
async function runAllTasks() {
    console.log('Iniciando processamento de imagens...');
    const allPromises = imageTasks.map(task => processImage(task));
    await Promise.all(allPromises);
    console.log('🎉 Processamento de todas as imagens concluído!');
}

runAllTasks();