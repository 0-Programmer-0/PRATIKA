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
            success: async function(data) {
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
                    const max = 1000000000000000000000;
                    post.idBotaoPumpCheio = post.id + "_pumpPreenchido"
                    post.idBotaoPumpVazio = post.id + "_pumpVazio";
                    post.impulsionarCheio = post.id + "_impulsionarVazio";
                    post.impulsionarVazio = post.id + "_impulsionarPreenchido";
                    // Serializa o post para JSON e o escapa para uso no HTML
                    const serializedPost = encodeURIComponent(JSON.stringify(post));
                    // Escapa aspas sem modificar outros caracteres
                    

                
                    const postHtml = `
                        <div class="tweet">
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
                            <div class="icons">
                                <button id="${post.idBotaoPumpVazio}" class="pump-button" onclick="comunidade().darPumpPost('${serializedPost}')" aria-label="Clique e dê um PUMP!">
                                    <img src="../img/pump_vazio.png" alt="" class="pump">
                                </button>
                                <button id="${post.idBotaoPumpCheio}" class="pump-button" onclick="comunidade().retirarPumpPost('${serializedPost}')" aria-label="Clique e dê um PUMP!" hidden>
                                    <img src="../img/pump_preenchido.png" alt="" class="pump">
                                </button>
                                <label>${post.qtdCurtidas}</label>
                                <button id="${post.impulsionarVazio}" class="relevancia-button" aria-label="Aumente a relevância desse post!">
                                    <img src="../img/relevancia_vazia.png" alt="" class="relevancia">
                                </button>
                                <button id="${post.impulsionarCheio}" class="relevancia-button" aria-label="Aumente a relevância desse post!" hidden>
                                    <img src="../img/relevancia_preenchido.png" alt="" class="relevancia">
                                </button>
                                <label>${post.qtdImpulsionamentos}</label>
                            </div>
                        </div>`;
                    postsContainer.innerHTML += postHtml;
                });
                          
               
            },                        
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Erro na requisição:', textStatus, errorThrown);
                alert('Erro ao cadastrar post. Tente novamente.'); console.error('Erro ao carregar posts:', error);
                document.getElementById('posts-container').innerHTML = '<p>Erro ao carregar os posts. Tente novamente mais tarde.</p>';
            }
        });
    }

    async function darPumpPost(dto) {
        const post = JSON.parse(decodeURIComponent(dto));
        
        console.log(post);
        
        try {
            // Realiza a requisição AJAX
            const data = await $.ajax({
                url: '/Comunidade/DarPumpPost', // Certifique-se do caminho correto
                type: 'POST',
                data: post, // Serializa o objeto como JSON
                dataType: 'json'
            });
            
            // Aguarda o carregamento dos posts após o sucesso
            await carregarPosts();
            
            // Adiciona um pequeno atraso para garantir que os elementos estejam prontos
            setTimeout(() => {
                tiraPumpVazioColocaPreenchido(post);
            }, 100); // 100 milissegundos de atraso
            
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao cadastrar post. Tente novamente.');
        }
    }
    
    async function retirarPumpPost(dto) {
        const post = JSON.parse(decodeURIComponent(dto));
        
        console.log(post);
        
        try {
            // Realiza a requisição AJAX
            const data = await $.ajax({
                url: '/Comunidade/RetirarPumpPost', // Certifique-se do caminho correto
                type: 'POST',
                data: post, // Serializa o objeto como JSON
                dataType: 'json'
            });
    
            // Aguarda o carregamento dos posts após o sucesso
            await carregarPosts();
            
            // Adiciona um pequeno atraso para garantir que os elementos estejam prontos
            setTimeout(() => {
                tiraPumpPreenchidoColocaVazio(post);
            }, 100); // 100 milissegundos de atraso
            
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao cadastrar post. Tente novamente.');
        }
    }
    

    async function tiraPumpVazioColocaPreenchido(post){
        
        // Após a execução, esconde o botão do "pump vazio"
        var vazio = post.id + "_pumpVazio";
        document.getElementById(vazio).hidden = true;
        var preenchido = post.id + "_pumpPreenchido";
        document.getElementById(preenchido).hidden = false;

        //$("#" + elementId).prop("hidden", true);
    }
    async function tiraPumpPreenchidoColocaVazio(post){
        
        // Após a execução, esconde o botão do "pump vazio"
        var vazio = post.id + "_pumpVazio";
        document.getElementById(vazio).hidden = false;
        var preenchido = post.id + "_pumpPreenchido";
        document.getElementById(preenchido).hidden = true;

        //$("#" + elementId).prop("hidden", true);
    }


    return {
        abrirModalNovaPostagem: abrirModalNovaPostagem,
        closeModal: closeModal,
        cadastrarPost: cadastrarPost,
        carregarPosts: carregarPosts,
        darPumpPost:darPumpPost,
        retirarPumpPost: retirarPumpPost
    };
}
