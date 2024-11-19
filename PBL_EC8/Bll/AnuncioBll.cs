using System.Security;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text;
using System.Runtime.InteropServices;
using Microsoft.AspNetCore.Routing.Template;

namespace PBL_EC8.Bll;

public class AnuncioBll : IAnuncioBll
{
    private readonly IMongoCollection<Anuncio> anunciosCollection;

    // Construtor que injeta a dependência de IMongoClient
    public AnuncioBll(IMongoClient mongoClient, string databaseName, string collectionName)
    {
        var database = mongoClient.GetDatabase(databaseName);
        anunciosCollection = database.GetCollection<Anuncio>(collectionName);
    }

    public async Task<RetornoAcaoDto> CriarAnuncio(AnuncioDto anuncioDto)
    {
        RetornoAcaoDto retorno = new RetornoAcaoDto();
        try
        {   
            Anuncio anuncio = new Anuncio();
            FilterDefinition<Anuncio> filtro = Builders<Anuncio>.Filter.Eq(m => m.IdUsuario, anuncioDto.IdUsuario);
            anuncio = await anunciosCollection.Find(filtro).FirstOrDefaultAsync();
            if (anuncio == null)
            {
                anuncio = ConverterAnuncioDto(anuncioDto);
                await anunciosCollection.InsertOneAsync(anuncio);
                retorno.Mensagem = "Anuncio inserido com sucesso!";
                retorno.Sucesso = true;
                return retorno;
            }
            else
            {
                retorno.Mensagem = "Já existe um anúncio para o seu perfil!";
                retorno.Sucesso = false;
            }
        }
        catch (Exception ex)
        {
            retorno.Mensagem = "Falha ao criar o anúncio...";
            retorno.Sucesso = false;
        }
        return retorno;
    }

    // public async Task<UsuarioDto> PesquisarAnuncios(UsuarioDto usuarioDto)
    // {
    //     try
    //     {
    //         var filtro = Builders<Usuario>.Filter.Or
    //                 (
    //                     Builders<Usuario>.Filter.Eq(u => u.Email, usuarioDto.Email),
    //                     Builders<Usuario>.Filter.Eq(u => u.NomeUsuario, usuarioDto.NomeUsuario)
    //                 );
    //         Usuario usuario = await _usuariosCollection.Find(filtro).FirstOrDefaultAsync();
    //         usuarioDto = ConverterUsuario(usuario);
    //     }
    //     catch (Exception ex)
    //     {
    //         Console.WriteLine("Falha ao pesquisar o usuário");
    //     }
    //     return usuarioDto;
    // }

    public async Task<List<AnuncioDto>> PesquisarTodosAnuncios()
    {
        List<AnuncioDto> retorno = new List<AnuncioDto>();
        List<Anuncio> listaAnuncio = await anunciosCollection.Find(_ => true).ToListAsync();
        foreach(Anuncio anuncio in listaAnuncio)
            retorno.Add(ConverterAnuncio(anuncio));
        return retorno;
    }

    private Anuncio ConverterAnuncioDto(AnuncioDto anuncioDto)
    {
        Anuncio anuncio = new Anuncio();

        anuncio.Titulo = anuncioDto.Titulo;
        anuncio.IdUsuario = anuncioDto.IdUsuario;
        anuncio.Profissao = anuncioDto.Profissao;
        anuncio.Estado = anuncioDto.Estado;
        anuncio.Cidade = anuncioDto.Cidade;
        anuncio.Descricao = anuncioDto.Descricao;
        anuncio.NomeAnunciante = anuncioDto.NomeAnunciante;
        anuncio.ImagemAnunciante = anuncioDto.ImagemAnunciante;
        return anuncio;
    }

    private AnuncioDto ConverterAnuncio(Anuncio anuncio)
    {
        AnuncioDto anuncioDto = new AnuncioDto();

        anuncioDto.Id = anuncio.Id;
        anuncioDto.Titulo = anuncio.Titulo;
        anuncioDto.IdUsuario = anuncio.IdUsuario;
        anuncioDto.Profissao = anuncio.Profissao;
        anuncioDto.Estado = anuncio.Estado;
        anuncioDto.Cidade = anuncio.Cidade;
        anuncioDto.Descricao = anuncio.Descricao;
        anuncioDto.NomeAnunciante = anuncio.NomeAnunciante;
        anuncioDto.ImagemAnunciante = anuncio.ImagemAnunciante;
        return anuncioDto;
    }
}
