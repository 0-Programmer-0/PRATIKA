function comunidade() {

    function abrirModalNovaPostagem() {
        $.ajax({
            url: '/Comunidade/ShowModalContent', // Rota do controller para retornar a partial view
            type: 'POST',
            success: function(response) {
                // Insere o conteúdo retornado pela partial view na modal
                const modalContainer = document.getElementById("modalContainer");
                modalContainer.innerHTML = response;  // Adiciona o HTML da partial view
                modalContainer.style.display = "flex"; // Exibe a modal
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

    // Fechar a modal clicando fora dela
    window.onclick = function(event) {
        const modalContainer = document.getElementById("modalContainer");
        if (event.target === modalContainer) {
            closeModal();
        }
    };

    return {
        abrirModalNovaPostagem: abrirModalNovaPostagem,
        closeModal: closeModal
    }

}