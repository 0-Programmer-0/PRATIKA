using System.Security;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text;
using System.Runtime.InteropServices;

namespace PBL_EC8.Bll;

public class UsuarioBll : IUsuarioBll
{
    private readonly IMongoCollection<Usuario> _usuariosCollection;

    // Construtor que injeta a dependência de IMongoClient
    public UsuarioBll(IMongoClient mongoClient, string databaseName, string collectionName)
    {
        var database = mongoClient.GetDatabase(databaseName);
        _usuariosCollection = database.GetCollection<Usuario>(collectionName);
    }

    // Método de criação de usuário, que tenta criar e retorna uma mensagem
    public async Task<RetornoAcaoDto> CriarUsuario(UsuarioDto usuarioDto)
    {
        RetornoAcaoDto retorno = new RetornoAcaoDto();
        try
        {
            Usuario usuario = ConverterUsuarioDto(usuarioDto); // Conversão do DTO
            UsuarioDto usuarioPesquisado = await PesquisarUsuario(usuarioDto);
            if (usuarioPesquisado != null)
            {
                retorno.Mensagem = "Já existe um usuário cadastrado com esse email";
                retorno.Retorno = false;
            }
            else
            {
                await _usuariosCollection.InsertOneAsync(usuario); // Aguarda o insert no MongoDB
                retorno.Mensagem = "Usuário criado com sucesso!";
                retorno.Retorno = true;
            }
        }
        catch (Exception ex)
        {
            retorno.Mensagem = "Falha ao criar o usuário...";
            retorno.Retorno = false;
        }
        return retorno;
    }

    public async Task<UsuarioDto> PesquisarUsuario(UsuarioDto usuarioDto)
    {
        try
        {
            var filtro = Builders<Usuario>.Filter.Eq(u => u.Email, usuarioDto.Email);
            Usuario usuario = await _usuariosCollection.Find(filtro).FirstOrDefaultAsync();
            usuarioDto = ConverterUsuario(usuario);
        }
        catch(Exception ex)
        {

        }
        return usuarioDto;
    }

    public async Task<List<Usuario>> PesquisarTodosUsuario()
    {
        return await _usuariosCollection.Find(_ => true).ToListAsync();
    }

    public void DeletarUsuario()
    {

    }

    public void AtualizarUsuario()
    {

    }

    private Usuario ConverterUsuarioDto(UsuarioDto usuarioDto)
    {
        Usuario usuario = new Usuario();

        usuario.Nome = usuarioDto.Nome;
        usuario.Email = usuarioDto.Email;
        usuario.Senha = usuarioDto.Senha;
        usuario.DataNascimento = Convert.ToDateTime(usuarioDto.DataNascimento);
        usuario.Descricao = usuarioDto.Descricao;
        usuario.Genero = usuarioDto.Genero;
        return usuario;
    }

    private UsuarioDto ConverterUsuario(Usuario usuario)
    {
        UsuarioDto usuarioDto = new UsuarioDto();

        usuarioDto.Nome = usuario.Nome;
        usuarioDto.Email = usuario.Email;
        usuarioDto.Senha = usuario.Senha;
        usuarioDto.DataNascimento = usuario.DataNascimento.ToString();
        usuarioDto.Descricao = usuario.Descricao;
        usuarioDto.Genero = usuario.Genero;
        return usuarioDto;
    }
}
