const base_path = window.location.origin;
var mensagemErro = "";

// Pegar a data atual e formatá-la como 'YYYY-MM-DD'
const dataAtual = new Date();
const ano = dataAtual.getFullYear();
const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
const dia = String(dataAtual.getDate()).padStart(2, '0');

// Formatar a data atual no formato 'YYYY-MM-DD'
const dataAtualFormatada = `${ano}-${mes}-${dia}`;

function menu() {
    var dto = {
        textboxLogin: $('#textboxLogin').val(),
        textboxEmail: $('#textboxEmail').val(),
        textboxSenha: $('#textboxSenha').val(),
        textboxConfirmacaoSenha: $('#textboxConfirmacaoSenha').val(),
        textboxDataNascimento: $('#textboxDataNascimento').val(),
        textareaDescricao: $('#textareaDescricao').val(),
        comboGenero: $('#comboGenero').find(":selected").text(),
        btnLogin: $('#btnLogin')
    }

    function verificarUsuario() {
        $(document).ready(function () {
            $.ajax({
                url: base_path + '/Home/VerificaUsuario', // Verifique se o base_path está correto
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

    function cadastrarUsuario() {
        if (validaCampos()) {
            debugger;
            $(document).ready(function () {
                $.ajax({
                    url: base_path + "/Home/CadastrarUsuario", // Verifique se o base_path está correto
                    data: {
                        dto: {
                            Nome: dto.textboxLogin,
                            Email: dto.textboxEmail,
                            Senha: dto.textboxSenha,
                            DataNascimento: dto.textboxDataNascimento,
                            Descricao: dto.textareaDescricao,
                            Genero: dto.comboGenero
                        }
                    },
                    type: 'POST', // Certifique-se de que o método do controlador está aceitando GET
                    dataType: 'json',
                    success: function (data) {
                        debugger;
                        alert(`${data.retorno}`);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('Erro na requisição:', textStatus, errorThrown);
                    }
                });
            });
        }
        else {
            alert(mensagemErro);
        }
    }

    function validaCampos() {
        if (dto.textboxLogin == "") {
            mensagemErro = "Por favor, preencha o campo de Login";
            return false;
        }
        else if (dto.textboxEmail == "") {
            mensagemErro = "Por favor, preencha o campo de Email";
            return false;
        }
        else if (dto.textboxSenha == "") {
            mensagemErro = "Por favor, preencha o campo de Senha";
            return false;
        }
        else if (dto.textboxConfirmacaoSenha == "") {
            mensagemErro = "Por favor, preencha o campo de Confirmação de Senha";
            return false;
        }
        else if (dto.textboxSenha != dto.textboxConfirmacaoSenha) {
            mensagemErro = "Os campos de senhas não são compatíveis";
            return false;
        }
        else if (dto.textboxDataNascimento == "") {
            mensagemErro = "Por favor, preencha o campo de Data de Nascimento";
            return false;
        }
        else if (new Date(dto.textboxDataNascimento) > new Date(dataAtualFormatada) || new Date(dto.textboxDataNascimento).getFullYear() < 1908 ) {
            mensagemErro = "Data de Nascimento inválida";
            return false;
        }
        else if (dto.textareaDescricao == "") {
            mensagemErro = "Por favor, preencha o campo de Descrição";
            return false;
        }
        else if (dto.comboGenero != "Masculino" && dto.comboGenero != "Feminino" && dto.comboGenero != "Outro") {
            mensagemErro = "Por favor, preencha o campo de Gênero corretamente";
            return false;
        }
        else {
            return true;
        }
    }

    return {
        verificarUsuario: verificarUsuario,
        cadastrarUsuario: cadastrarUsuario,
        validaCampos: validaCampos
    };
}
