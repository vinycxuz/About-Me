const express = require('express');
const app = express();
const dotenv = require('dotenv');

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
            markdown += `${article.url}\n\n`;
        });
        res.send(markdown); // Send the markdown content as response
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar artigos' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});