// imports
const express = require('express');
const cors = require('cors');
const UserRoutes = require('./routes/UserRoutes');
const PetRoutes = require('./routes/PetRoutes');
// imports

const app = express();

// Config JSON response
app.use(express.json());

// Solve CORS
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5137']; // Adicione as origens permitidas aqui

app.use(
    cors({
        credentials: true,
        origin: (origin, callback) => {
            // Permite origens da lista ou requisições sem origem (ex.: Postman)
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true); // Permite a requisição
            } else {
                callback(new Error('Not allowed by CORS')); // Bloqueia a requisição
            }
        },
    })
);

// public folder for images
app.use(express.static('public'));

// Routes
app.use('/users', UserRoutes);
app.use('/pets', PetRoutes);

// Ensure that the backend always runs on port 5555
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
