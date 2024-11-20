const getToken = (request) => {
    const authHeader = request.headers.authorization;

    //Checks if the authorization header is present and contains the token
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Token não fornecido ou formato inválido");
    }

    const token = authHeader.split(" ")[1];
    return token;
}
module.exports = getToken