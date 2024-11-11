base_path = window.location.origin;
var mensagemErro = "";

function anuncios() {
    var dto = {
        modalCadastroAnuncio: $('#modalCadastroAnuncio'),
        modalPerfilInvalido: $('#modalPerfilInvalido'),

        //Campos do modal
        divImagemPerfil: $('#divImagemPerfil'),
        imgPreview: $('#imgPreview'),
        textboxTitulo: $("#textboxTitulo").val(),
        textboxProfissao: $("#textboxProfissao").val(),
        comboEstado: $("#comboEstado :selected").text(),
        textboxCidade: $("#textboxCidade").val(),
        textareaDescricao: $("#textareaDescricao").val(),
        btnCadastrarAnuncio: $('#btnCadastrarAnuncio')
    }

    function abrirModalCadastrarAnuncio() {
        $(document).ready(function () {
            $.ajax({
                url: base_path + "/Anuncios/ValidacaoPerfil",
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    if (data.success) {
                        dto.modalCadastroAnuncio.css('display', 'flex');
                        debugger;
                        if (data.imagemPerfil != null) {
                            dto.imgPreview.attr('src', data.imagemPerfil);
                            dto.divImagemPerfil.show();
                        }
                        else
                            dto.divImagemPerfil.hide();
                    }
                    else {
                        dto.modalPerfilInvalido.css('display', 'flex');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Erro na requisição:', textStatus, errorThrown);
                }
            });
        });

    }

    function fecharModalCadastrarAnuncio() {
        dto.modalCadastroAnuncio.css('display', 'none'); // Oculta o modal
    }

    function fecharModalPerfilInvalido() {
        dto.modalPerfilInvalido.css('display', 'none');
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

    function cadastrarAnuncio() {
        if (validaCampos()) {
            debugger;
            $(document).ready(function () {
                $.ajax({
                    url: base_path + "/Anuncios/CadastrarAnuncio",
                    data: {
                        dto: {
                            Titulo: dto.textboxTitulo,
                            Profissao: dto.textboxProfissao,
                            Estado: dto.comboEstado,
                            Cidade: dto.textboxCidade,
                            Descricao: dto.textareaDescricao
                        }
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
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
        }
        else {
            alert(mensagemErro);
        }
    }

    function validaCampos() {
        return true;
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
        abrirModalCadastrarAnuncio: abrirModalCadastrarAnuncio,
        fecharModalCadastrarAnuncio: fecharModalCadastrarAnuncio,
        fecharModalPerfilInvalido: fecharModalPerfilInvalido,
        inserirImagem: inserirImagem,
        cadastrarAnuncio: cadastrarAnuncio
    }
}
