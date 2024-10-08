function menu() {
    function campos() {
        textboxLogin = "#textboxLogin";
        btnLogin = "#btnLogin";
    }

    function verificaLogin() {
        alert(document.getElementById(campos.btnLogin));
    }

    function verificaLoginAjax() {
        $(document).ready(function() {
            $(campos.btnLogin).click(function() {
                const userId = 1; // ID do usuário que você deseja buscar
                
                $.ajax({
                    url: `https://localhost:5001/api/user/${userId}`, // URL da sua API
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        // Aqui você manipula a resposta com sucesso
                        alert(`Nome: ${data.name}\nEmail: ${data.email}`);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        // Manipulação de erro
                        console.error('Erro na requisição:', textStatus, errorThrown);
                    }
                });
            });
        });
        
    }

    return {
        campos: campos,
        verificaLogin: verificaLogin
    };
}
