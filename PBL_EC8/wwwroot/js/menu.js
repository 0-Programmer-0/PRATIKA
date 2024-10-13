const base_path = window.location.href;

function menu() {
    function campos() {
        textboxLogin = "#textboxLogin";
        btnLogin = "#btnLogin";
    }

    function verificaUsuario() {
        alert(base_path);
    }

    function verificaUsuarioAjax() {
        alert(base_path + "Home/VerificaLogin")
        $(document).ready(function () {
            $.ajax({
                url: base_path + 'Home/VerificaLogin', // Verifique se o base_path está correto
                data: {
                    login: "teste",
                    senha: "123"
                },
                type: 'GET', // Certifique-se de que o método do controlador está aceitando GET
                dataType: 'json',
                success: function (data) {
                    alert(`Resposta: ${data}`);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Erro na requisição:', textStatus, errorThrown);
                }
            });
        });

    }

    return {
        campos: campos,
        verificaUsuario: verificaUsuario,
        verificaUsuarioAjax: verificaUsuarioAjax
    };
}
