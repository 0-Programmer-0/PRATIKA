document.addEventListener('DOMContentLoaded', function () {
    const page = document.body.getAttribute('data-page'); // Obtém a identificação da página
    debugger;
    if(page == 'comunidade') {
        const btnCriacaoConteudo = $('#btnCriacaoConteudo');
        btnCriacaoConteudo.text("Postar");
        // btnCriacaoConteudo.on('click', anuncios().abrirModalCadastrarAnuncio);
        // anuncios().pesquisarTodosAnuncios();
    }   
});

function comunidade() {
    function abrirModalNovaPostagem() {
        $.ajax({
            url: '/Comunidade/ShowModalContent',
            type: 'POST',
            success: function(response) {
                const modalContainer = document.getElementById("modalContainer");
                modalContainer.innerHTML = response;
                modalContainer.style.display = "flex";
                modalContainer.style.position = "fixed";
                modalContainer.style.top = "0";
                modalContainer.style.left = "0";
                modalContainer.style.width = "100%";
                modalContainer.style.height = "100%";
                modalContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                modalContainer.style.justifyContent = "center";
                modalContainer.style.alignItems = "center";
            },
            error: function() {
                console.log("Erro ao carregar o conteúdo da modal.");
            }
        });
    }

    function closeModal() {
        document.getElementById("modalContainer").style.display = "none";
    }

    window.onclick = function(event) {
        const modalContainer = document.getElementById("modalContainer");
        if (event.target === modalContainer) {
            closeModal();
        }
    };

    async function cadastrarPost() {
        const dto = {
            descricao: $('#postContent').val(),
        };
    
        // Obtém o arquivo selecionado
        const fileInput = $('#fileInput')[0];
        const file = fileInput.files[0];
    
        if (file) {
            try {
                // Converte o arquivo para base64 de forma assíncrona
                const base64String = await convertFileToBase64(file);
                dto.fotoAnexo = base64String; // Agora a foto estará em base64
            } catch (error) {
                console.error('Erro ao converter a imagem:', error);
                alert('Erro ao converter a imagem. Tente novamente.');
                return;
            }
        } else {
            dto.fotoAnexo = null; // Caso nenhum arquivo tenha sido selecionado
        }
    
        console.log(dto); // Verifique se a foto está correta no objeto
    
        // Envia a requisição AJAX
        $.ajax({
            url: '/Comunidade/CadastrarPost', // Certifique-se do caminho correto
            type: 'POST',
            data:dto, // Serializa o objeto como JSON
            dataType: 'json',
            success: function(data) {
                alert(data.message);
                if (data.success) {
                    closeModal(); // Fecha a modal após sucesso
                    window.location.reload(); // Recarrega a página
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Erro na requisição:', textStatus, errorThrown);
                alert('Erro ao cadastrar post. Tente novamente.');
            }
        });
    }
    
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]); // Remove o prefixo 'data:*/*;base64,'
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }
    

    async function carregarPosts() {

        $.ajax({
            url: '/Comunidade/ListarPosts', // Certifique-se do caminho correto
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                console.log(data);
                if (!data || data.length === 0) {
                    document.getElementById('posts-container').innerHTML = '<p>Nenhum post encontrado.</p>';
                    return;
                }
            
                // Limpe o contêiner
                const postsContainer = document.getElementById('posts-container');
                postsContainer.innerHTML = '';
                data.forEach(post => {
                    let profilePicHtml = '';
                    
                    // Verifique se a imagem Base64 está presente (foto de perfil)
                    if (post.fotoAnexo) {
                        // Não adicione a foto no perfil, mas adicione abaixo da descrição
                        profilePicHtml = `<img src="data:image/png;base64,${post.fotoAnexo}" alt="Foto do post" class="post-image">`;
                    }
                
                    const postHtml = `
                        <div class="tweet">
                            <div class="icons">
                                <button class="pump-button" aria-label="Clique e dê um PUMP!">
                                    <img src="../img/pump_vazio.png" alt="" class="pump">
                                </button>
                                <label>${post.qtdCurtidas}</label>
                                <button class="relevancia-button" aria-label="Aumente a relevância desse post!">
                                    <img src="../img/relevancia_vazia.png" alt="" class="relevancia">
                                </button>
                                <label>${post.qtdImpulsionamentos}</label>
                            </div>
                            <div class="tweet-content">
                                <div>
                                    <span class="username">${post.nomeUsuario || 'Usuário Anônimo'}</span>
                                    <span class="handle">@${post.idUsuario}</span>
                                </div>
                                <div class="content">${post.descricao}</div>
                            </div>
                            <!-- Adicione a foto abaixo da descrição -->
                            <div class="post-image-container">
                                ${profilePicHtml} <!-- Adiciona a imagem apenas se disponível -->
                            </div>
                        </div>`;
                    postsContainer.innerHTML += postHtml;
                });
                
            
                // Adicionar eventos aos botões
                document.querySelectorAll('.pump-button').forEach(button => {
                    button.addEventListener('click', () => alert('Você deu um PUMP!'));
                });
                document.querySelectorAll('.relevancia-button').forEach(button => {
                    button.addEventListener('click', () => alert('Você aumentou a relevância!'));
                });
            },                        
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Erro na requisição:', textStatus, errorThrown);
                alert('Erro ao cadastrar post. Tente novamente.'); console.error('Erro ao carregar posts:', error);
                document.getElementById('posts-container').innerHTML = '<p>Erro ao carregar os posts. Tente novamente mais tarde.</p>';
            }
        });
    }

    return {
        abrirModalNovaPostagem: abrirModalNovaPostagem,
        closeModal: closeModal,
        cadastrarPost: cadastrarPost,
        carregarPosts: carregarPosts
    };
}
