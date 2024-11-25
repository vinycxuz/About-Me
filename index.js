import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get('/', async (req, res) => {
    try {
        const response = await fetch('https://dev.to/api/articles?username=vinycxuz', {
            headers: {
                'api-key': process.env.DEVTO_API
            }
        });
        const articles = await response.json();
        let markdown = '# Latest Articles\n\n';
        articles.forEach(article => {
            markdown += `## ${article.title}\n`;
            markdown += `${article.url}\n\n`;
        });

        const readmePath = path.join(__dirname, 'README.md');
        const readmeContent = fs.readFileSync(readmePath, 'utf8');
        const updatedReadme = readmeContent.replace(
            /<!--START_SECTION:latest-articles-->[\s\S]*<!--END_SECTION:latest-articles-->/,
            `<!--START_SECTION:latest-articles-->\n${markdown}\n<!--END_SECTION:latest-articles-->`
        );

        fs.writeFileSync(readmePath, updatedReadme);

        console.log('README.md atualizado com sucesso.');
        res.send(markdown);
    } catch (error) {
        console.error('Erro ao buscar artigos ou atualizar README.md:', error);
        res.status(500).json({ error: 'Erro ao buscar artigos' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});