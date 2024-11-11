const base_path = window.location.origin;
var mensagemErro = "";
document.addEventListener("DOMContentLoaded", function() {
    tokenCheck().checkToken(); // Inicializa a verificação do token após o carregamento do DOM
});

function tokenCheck() {
    function checkToken() {
         
        const token = sessionStorage.getItem('token');
        if (!token || isTokenExpired(token)) {
            showLoginPopup();
        }
    }

    function isTokenExpired(token) {
         
        try {
            // Extrair a parte payload do token (segunda parte)
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Obter o tempo atual em segundos
            const currentTime = Math.floor(Date.now() / 1000);

            // Verificar se o token expirou
            return currentTime > payload.exp;
        } catch (error) {
            console.error("Token inválido:", error);
            return true; // Considera expirado se houver um erro ao processar
        }
    }

    function showLoginPopup() {
        const loginPopup = document.getElementById('loginPopup');
        if (loginPopup) {
            loginPopup.style.display = 'flex';
        } else {
            console.error("Elemento 'loginPopup' não encontrado.");
        }
    }

    function hideLoginPopup() {
        const loginPopup = document.getElementById('loginPopup');
        if (loginPopup) {
            loginPopup.style.display = 'none';
        } else {
            console.error("Elemento 'loginPopup' não encontrado.");
        }
    }

    function validacaoLogin() {
        $(document).ready(function () {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            $.ajax({
                url: base_path + "/Home/ValidacaoLogin",
                data: {
                    login: username,
                    senha: password
                },
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    if (data.success) {
                         
                        alert("usuário validado com sucesso")
                        expiracaoToken(data.token);
                        hideLoginPopup();
                    }
                    else
                        alert("falha ao validar o usuário");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Erro na requisição:', textStatus, errorThrown);
                }
            });
        });
    }

    function expiracaoToken(token) {
        const expiration = JSON.parse(atob(token.split('.')[1])).exp * 1000; // Converte o 'exp' para milissegundos
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('tokenExpiration', expiration);
    }

    return {
        checkToken: checkToken,
        isTokenExpired: isTokenExpired,
        showLoginPopup: showLoginPopup,
        hideLoginPopup: hideLoginPopup,
        validacaoLogin: validacaoLogin,
        expiracaoToken: expiracaoToken
    };
}
