document.addEventListener('DOMContentLoaded', function () {
    const page = document.body.getAttribute('data-page'); // Obtém a identificação da página
    if(page == 'anuncios') {
        const btnCriacaoConteudo = $('#btnCriacaoConteudo');
        btnCriacaoConteudo.text("Anunciar");
        btnCriacaoConteudo.on('click', anuncios().abrirModalCadastrarAnuncio);
        anuncios().pesquisarTodosAnuncios();
    }   
});

function anuncios() {
    var dto = {
        textboxPesquisaAnuncios: $('#textboxPesquisaAnuncios').val(),
        modalCadastroAnuncio: $('#modalCadastroAnuncio'),
        modalPerfilInvalido: $('#modalPerfilInvalido'),
        btnCriacaoConteudo: $('#btnCriacaoConteudo').text(),

        //Campos do modal
        divImagemPerfil: $('#divImagemPerfil'),
        imgPreview: $('#imgPreview'),
        textboxTitulo: $("#textboxTitulo").val(),
        textboxProfissao: $("#textboxProfissao").val(),
        comboEstado: $("#comboEstado :selected").val(),
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
        dto.modalCadastroAnuncio.css('display', 'none');
        $("#textboxTitulo").val('');
        $("#textboxProfissao").val('');
        $("#comboEstado").prop("selectedIndex", 0);
        $("#textboxCidade").val('');
        $("#textareaDescricao").val('');
    }

    function fecharModalPerfilInvalido() {
        dto.modalPerfilInvalido.css('display', 'none');
    }

    function inserirImagem(inputImagem) {
        $('#divImagemPerfil').removeAttr('hidden');
        const file = inputImagem.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#imgPreview').attr('src', e.target.result).show();
            };
            reader.readAsDataURL(file);
        }
    }

    function cadastrarAnuncio() {
        if (validaCampos()) {
            $(document).ready(function () {
                $.ajax({
                    url: base_path + "/Anuncios/CadastrarAnuncio",
                    data: {
                        dto: {
                            Titulo: dto.textboxTitulo,
                            Profissao: dto.textboxProfissao,
                            Estado: dto.comboEstado,
                            Cidade: dto.textboxCidade,
                            Descricao: dto.textareaDescricao,
                            ImagemAnunciante: dto.imgPreview.attr('src')
                        }
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        alert(`${data.message}`);
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

    function pesquisarTodosAnuncios() {
        $(document).ready(function () {
            $.ajax({
                url: base_path + "/Anuncios/PesquisarTodosAnuncios",
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    criarAnunciosHtml(data.lista);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Erro na requisição:', textStatus, errorThrown);
                }
            });
        });
    }

    function pesquisarAnuncio() {
        if (dto.textboxPesquisaAnuncios != '') {
            $(document).ready(function () {
                $.ajax({
                    url: base_path + "/Anuncios/PesquisarAnuncios",
                    data: {
                        pesquisa: dto.textboxPesquisaAnuncios
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        criarAnunciosHtml(data.lista);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('Erro na requisição:', textStatus, errorThrown);
                    }
                });
            });
        }
        else {
            $(document).ready(function () {
                $.ajax({
                    url: base_path + "/Anuncios/PesquisarTodosAnuncios",
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        criarAnunciosHtml(data.lista);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('Erro na requisição:', textStatus, errorThrown);
                    }
                });
            });
        }
    }

    function criarAnunciosHtml(listaAnuncios) {
        // Seleciona a div pai onde os anúncios serão inseridos
        const divAnuncios = document.getElementById('divAnuncios');

        // Limpa a div antes de adicionar novos elementos (opcional)
        divAnuncios.innerHTML = '';

        // Itera sobre cada anúncio na lista
        listaAnuncios.forEach(anuncio => {
            // Cria a estrutura do card
            const card = document.createElement('div');
            card.classList.add('card');

            // Cria o container da imagem
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('img-container');

            const img = document.createElement('img');
            img.id = 'imagem_card';
            img.src = anuncio.imagemAnunciante || '../img/default_usuario.png'; // Usa a imagem do anúncio ou uma padrão
            img.alt = 'Imagem do anunciante';
            imgContainer.appendChild(img);

            // Cria o container do texto
            const textContainer = document.createElement('div');
            textContainer.classList.add('text-container');

            const h1 = document.createElement('h1');
            h1.id = 'anunciante_card';
            h1.textContent = anuncio.nomeAnunciante;

            const h2 = document.createElement('h2');
            h2.id = 'profissao_card';
            h2.textContent = anuncio.profissao;

            const h3 = document.createElement('h3');
            h3.id = 'localizacao_card';
            h3.textContent = anuncio.cidade + " - " + anuncio.estado;

            textContainer.append(h1, h2, h3);

            // Cria a descrição
            const description = document.createElement('div');
            description.classList.add('description');

            const p = document.createElement('p');
            p.id = 'descricao_card';
            p.textContent = anuncio.descricao;

            description.appendChild(p);

            // Adiciona os elementos ao card
            card.append(imgContainer, textContainer, description);

            // Adiciona o card à div pai
            divAnuncios.appendChild(card);
            divAnuncios.appendChild(document.createElement('br'));
        });
    }


    function validaCampos() {
        if (dto.textboxTitulo == '') {
            mensagemErro = "Por favor, escolha uma imagem para o anúncio!";
            return false;
        }
        else if (dto.textboxProfissao == '') {
            mensagemErro = "Por favor, preencha o nome do item do anúncio";
            return false;
        }
        else if (dto.comboEstado == '') {
            mensagemErro = "Por favor, preencha um contato para o anúncio";
            return false;
        }
        else if (dto.textboxCidade == '') {
            mensagemErro = "Por favor, preencha o método de pagamento do anúncio";
            return false;
        }
        else if (dto.textareaDescricao == '') {
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
        cadastrarAnuncio: cadastrarAnuncio,
        pesquisarTodosAnuncios: pesquisarTodosAnuncios,
        pesquisarAnuncio: pesquisarAnuncio
    }
}
