using System.Security;

namespace PBL_EC8.Bll
{
    public class UsuarioBll
    {
        // Método de exemplo que faz alguma lógica de negócio
        public string GetUserNameById(int userId)
        {
            // Lógica de negócios (exemplo simples)
            return $"Nome do usuário com ID {userId}";
        }

        public string VerificaUsuario(string login, string senha)
        {
            return $"Parabéns {login}, sua senha é {senha}";
        }
    }
}
