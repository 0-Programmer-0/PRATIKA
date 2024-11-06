const base_path = window.location.origin;
var mensagemErro = "";

function anuncios() {
    var dto = {
        textboxLogin: $("#textboxLogin").val(),
        modalAnuncios: $('#modalAnuncios'),
        btnAbrirModal: $('#btnAbrirModal'),
        btnCadastrarAnuncio: $('#btnCadastrarAnuncio'),
        textboxNomeItemAnuncio: $("#textboxNomeItemAnuncio").val(),
        textboxContatoAnuncio: $("#textboxContatoAnuncio").val(),
        comboMetodoPagamentoAnuncio: $("#comboMetodoPagamentoAnuncio :selected").text(),
        textboxDescricaoAnuncio: $("#textboxDescricaoAnuncio").val(),
        inputImagem: $('#inputImagem')
    }

    function abrirModal() {
        dto.modalAnuncios.css('display', 'flex'); // Mostra o modal usando Flexbox para centralizar
    }
    
    function fecharModal() {
        dto.modalAnuncios.css('display', 'none'); // Oculta o modal
    }

    function inserirImagem(inputImagem) {
        $('#divImagemPerfil').removeAttr('hidden');
        const file = inputImagem.files[0]; // Pega o primeiro arquivo do input
        if (file) {
            const reader = new FileReader(); // Cria um FileReader

            reader.onload = function (e) {
                $('#imgPreview').attr('src', e.target.result).show(); // Define a fonte da imagem para o resultado do FileReader e mostra a imagem
            };

            reader.readAsDataURL(file); // Lê o arquivo como URL de dados
        }
    }

    //precisa terminar o metodo de criar anuncios
    function cadastrarAnuncio() {
        if (validaCampos()) {
            $(document).ready(function () {
                converterImagem(dto.imagemInput[0].files[0], function(imagemProcessada) {
                    console.log(imagemProcessada);
                    $.ajax({
                        url: base_path + "/Home/CadastrarUsuario", // Verifique se o base_path está correto
                        data: {
                            dto: {
                                ImagemPerfil: imagemProcessada,
                                NomeUsuario: dto.textboxNomeUsuario,
                                Nome: dto.textboxNome,
                                Sobrenome: dto.textboxSobrenome,
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
                            alert(`${data.message}`);
                            if (data.success) {
                                window.location.href = data.redirectUrl;
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error('Erro na requisição:', textStatus, errorThrown);
                        }
                    });
                });               
            });
        }
        else {
            alert(mensagemErro);
        }
    }

    function validaCampos() {
        if (dto.inputImagem[0].files.length == 0) {
            mensagemErro = "Por favor, escolha uma imagem para o anúncio!";
            return false;
        }
        else if (dto.textboxNomeItemAnuncio == "") {
            mensagemErro = "Por favor, preencha o nome do item do anúncio";
            return false;
        }
        else if (dto.textboxContatoAnuncio == "") {
            mensagemErro = "Por favor, preencha um contato para o anúncio";
            return false;
        }
        else if (dto.comboMetodoPagamentoAnuncio == "") {
            mensagemErro = "Por favor, preencha o método de pagamento do anúncio";
            return false;
        }
        else if (dto.textboxDescricaoAnuncio == "") {
            mensagemErro = "Por favor, preencha o campo de descrição do anúncio";
            return false;
        }

        return true;
    }

    return {
        inserirImagem: inserirImagem,
        validaCampos: validaCampos,
        abrirModal: abrirModal,
        fecharModal: fecharModal,
        inserirImagem: inserirImagem
    };
}
