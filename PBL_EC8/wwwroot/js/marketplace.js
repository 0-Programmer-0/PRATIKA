document.addEventListener('DOMContentLoaded', function () {
    const page = document.body.getAttribute('data-page'); // Obtém a identificação da página
    if (page == 'marketplace') {
        const btnCriacaoConteudo = $('#btnCriacaoConteudo');
        btnCriacaoConteudo.text("Anunciar");
        btnCriacaoConteudo.on('click', marketplace().abrirModalCadastrarItem);
        marketplace().pesquisarTodosItens();
        $('#modalCadastroItem').hide();
    }
});

function marketplace() {
    var dto = {
        textboxPesquisaAnuncios: $('#textboxPesquisaAnuncios').val(),
        modalCadastroItem: $('#modalCadastroItem'),
        btnCriacaoConteudo: $('#btnCriacaoConteudo').text(),

        //Campos do modal
        divImgItemCadastro: $('#divImgItemCadastro'),
        imgItemCadastro: $('#imgItemCadastro'),
        textboxTitulo: $("#textboxTitulo").val(),
        textboxValor: $("#textboxValor").val(),
        textboxQtd: $("#textboxQtd").val(),
        textboxContato: $("#textboxContato").val(),
        textboxMetodoPagamento: $("#textboxMetodoPagamento").val(),
        textareaDescricao: $("#textareaDescricao").val(),
        btnCadastrarItem: $('#btnCadastrarItem')
    }

    document.getElementById('textboxValor').addEventListener('input', function () {
        let value = this.value.replace(/[^\d]/g, ''); // Remove tudo que não for número
        if (value.length === 0) {
            this.value = 'R$0,00'; // Valor inicial vazio
            return;
        }
        this.value = 'R$' + value;
    }); 
    
    document.getElementById('textboxValor').addEventListener('blur', function () {
        let value = this.value.replace(/[^\d]/g, ''); // Remove tudo que não for número
        if (value.length === 0) {
            this.value = 'R$0,00'; // Valor padrão se o campo estiver vazio
            return;
        }
        value = parseFloat(value) / 100; // Converte para valor decimal
        this.value = 'R$' + value
            .toFixed(2) // Garante duas casas decimais
            .replace('.', ',') // Troca o ponto pela vírgula
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona o separador de milhares
    });
    
    

    function abrirModalCadastrarItem() {
        dto.modalCadastroItem.show();
    }

    function fecharModalCadastrarItem() {
        dto.modalCadastroItem.hide();
        dto.textboxTitulo = '';
        dto.textboxValor = '';
        dto.textboxQtd = '';
        dto.textboxContato = '';
        dto.textboxMetodoPagamento = '';
        dto.textareaDescricao = '';
    }

    function inserirImagem(inputImagem) {
        $('#divImgItemCadastro').show();
        const file = inputImagem.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                dto.imgItemCadastro.attr('src', e.target.result).show();
            };

            reader.readAsDataURL(file);
        }
    }

    function cadastrarItem() {
        if (validaCampos()) {
            $(document).ready(function () {
                $.ajax({
                    url: base_path + "/Marketplace/CadastrarItem",
                    data: {
                        dto: {
                            ImagemItem: dto.imgItemCadastro.attr('src'),
                            Titulo: dto.textboxTitulo,
                            Valor: dto.textboxValor,
                            Quantidade: dto.textboxQtd,
                            MetodoPagamento: dto.textboxMetodoPagamento,
                            Contato: dto.textboxContato,
                            Descricao: dto.textareaDescricao
                        }
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        alert(`${data.message}`);
                        fecharModalCadastrarItem();
                        pesquisarTodosItens();

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

    function pesquisarTodosItens() {
        $(document).ready(function () {
            $.ajax({
                url: base_path + "/Marketplace/PesquisarTodosItens",
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    criarItemHtml(data.lista);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error('Erro na requisição:', textStatus, errorThrown);
                }
            });
        });
    }

    function pesquisarItens() {
        if (dto.textboxPesquisaAnuncios != '') {
            $(document).ready(function () {
                $.ajax({
                    url: base_path + "/Marketplace/PesquisarItens",
                    data: {
                        pesquisa: dto.textboxPesquisaAnuncios
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        debugger;
                        criarItemHtml(data.lista);
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
                    url: base_path + "/Marketplace/PesquisarTodosItens",
                    type: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        criarItemHtml(data.lista);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('Erro na requisição:', textStatus, errorThrown);
                    }
                });
            });
        }
    }

    function criarItemHtml(listaItens) {
        // Seleciona a div pai onde os itens serão inseridos
        const divItens = document.getElementById('divItens');

        // Limpa a div antes de adicionar novos elementos (opcional)
        divItens.innerHTML = '';

        listaItens.forEach(item => {
            // Criação da div principal
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
    
            // Div para a imagem do item
            const divImagemItem = document.createElement('div');
            divImagemItem.classList.add('divImagemItem');
            const imgItem = document.createElement('img');
            imgItem.id = 'imgItem';
            imgItem.src = item.imagemItem || ''; // Valor da imagem
            imgItem.alt = 'Imagem do item';
            divImagemItem.appendChild(imgItem);
            itemDiv.appendChild(divImagemItem);
            itemDiv.appendChild(document.createElement('br'));
    
            // Título do item
            const lblTitulo = document.createElement('label');
            lblTitulo.classList.add('lblTitulo');
            lblTitulo.textContent = item.titulo || ''; // Valor do título
            itemDiv.appendChild(lblTitulo);
            itemDiv.appendChild(document.createElement('br'));
    
            // Valor do item
            const lblValor = document.createElement('label');
            lblValor.classList.add('lblValor');
            lblValor.textContent = item.valor || ''; // Valor do preço
            itemDiv.appendChild(lblValor);
            itemDiv.appendChild(document.createElement('br'));
    
            // Quantidade disponível
            const lblQuantidade = document.createElement('label');
            lblQuantidade.textContent = `Quantidade Disponível: ${item.quantidade || ''}`; // Valor da quantidade
            itemDiv.appendChild(lblQuantidade);
            itemDiv.appendChild(document.createElement('br'));
    
            // Contato
            const lblContato = document.createElement('label');
            lblContato.classList.add('lblContato');
            lblContato.textContent = `Contato: ${item.contato || ''}`; // Valor do contato
            itemDiv.appendChild(lblContato);
            itemDiv.appendChild(document.createElement('br'));
    
            // Método de pagamento
            const lblMetodoPagamento = document.createElement('label');
            lblMetodoPagamento.classList.add('lblMetodoPagamento');
            lblMetodoPagamento.textContent = `Método Pagamento: ${item.metodoPagamento || ''}`; // Valor do método de pagamento
            itemDiv.appendChild(lblMetodoPagamento);
            itemDiv.appendChild(document.createElement('br'));
            itemDiv.appendChild(document.createElement('br'));
    
            // Descrição
            const lblDescricao = document.createElement('label');
            lblDescricao.classList.add('lblDescricao');
            lblDescricao.textContent = item.descricao || ''; // Valor da descrição
            itemDiv.appendChild(lblDescricao);
            itemDiv.appendChild(document.createElement('br'));
            itemDiv.appendChild(document.createElement('br'));
    
            // Anunciante
            const lblUsuario = document.createElement('label');
            lblUsuario.classList.add('lblUsuario');
            lblUsuario.textContent = `Anunciante: ${item.nomeUsuario || ''}`; // Valor do usuário
            itemDiv.appendChild(lblUsuario);
    
            // Adicionar ao DOM
            divItens.appendChild(itemDiv);
        });
    }
    


    function validaCampos() {
        if (dto.imgItemCadastro.attr('src') == '#') {
            mensagemErro = "Por favor, escolha uma imagem para o item";
            return false;
        }
        else if (dto.textboxTitulo == '') {
            mensagemErro = "Por favor, preencha um titulo para o item";
            return false;
        }
        else if (dto.textboxValor == '') {
            mensagemErro = "Por favor, preencha um valor para o item";
            return false;
        }
        else if (dto.textboxQtd == '') {
            mensagemErro = "Por favor, preencha a quantidade de itens disponíveis";
            return false;
        }
        else if (dto.textboxMetodoPagamento == '') {
            mensagemErro = "Por favor, preencha o campo de Método de Pagamento do item";
            return false;
        }
        else if (dto.textboxContato == '') {
            mensagemErro = "Por favor, preencha um contato para o item";
            return false;
        }
        else if (dto.textareaDescricao == '') {
            mensagemErro = "Por favor, preencha o campo de descrição do item";
            return false;
        }

        return true;
    }

    return {
        inserirImagem: inserirImagem,
        validaCampos: validaCampos,
        abrirModalCadastrarItem: abrirModalCadastrarItem,
        fecharModalCadastrarItem: fecharModalCadastrarItem,
        cadastrarItem: cadastrarItem,
        pesquisarTodosItens: pesquisarTodosItens,
        pesquisarItens: pesquisarItens
    }
}
