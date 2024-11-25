const express = require('express');
const app = express();
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

app.get('/', (req, res) => {
    res.send('Olá, mundo!');
});

app.get('/articles', async (req, res) => {
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
            markdown += `${article.url}\n`;
        });

        const readmePath = path.join(__dirname, 'README.md');
        const readmeContent = fs.readFileSync(readmePath, 'utf8');
        const updatedReadme = readmeContent.replace(
            '<!--START_SECTION:latest-articles-->.*<!--END_SECTION:latest-articles-->',
            `<!--START_SECTION:latest-articles-->\n${markdown}\n<!--END_SECTION:latest-articles-->`
        );
        fs.writeFileSync(readmePath, updatedReadme);

        res.send(markdown); 
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar artigos' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});