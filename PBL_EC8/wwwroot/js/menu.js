const base_path = window.location.href;

function menu() {
    var dto = {
        textboxLogin: document.getElementById("textboxLogin").value,
        textboxSenha: document.getElementById("textboxSenha").value,
        btnLogin: document.getElementById("btnLogin")
    }

    function verificaUsuario() {
        alert(base_path);
    }

    function verificaUsuarioAjax() {
        alert(base_path + "Home/VerificaUsuario")
        $(document).ready(function () {
            $.ajax({
                url: base_path + 'Home/VerificaUsuario', // Verifique se o base_path está correto
                data: {
                    login: dto.textboxLogin,
                    senha: dto.textboxSenha
                },
                type: 'GET', // Certifique-se de que o método do controlador está aceitando GET
                dataType: 'json',
                success: function (data) {
                    alert(`Resposta: ${data.retorno}`);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Erro na requisição:', textStatus, errorThrown);
                }
            });
        });

    }

    return {
        verificaUsuario: verificaUsuario,
        verificaUsuarioAjax: verificaUsuarioAjax
    };
}
