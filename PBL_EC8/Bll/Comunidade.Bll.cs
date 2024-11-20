using System.Security;
using Microsoft.AspNetCore.Mvc;
using Pbl_EC8.Models;
using PBL_EC8.Bll;
using PBL_EC8;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text;
using System.Runtime.InteropServices;
using Microsoft.AspNetCore.Routing.Template;

namespace PBL_EC8.Bll;

public class ComunidadeBll : IComunidadeBll
{
    private readonly IMongoCollection<Posts> postsCollection;

    public ComunidadeBll(IMongoClient mongoClient, string databaseName, string collectionName)
    {
        var database = mongoClient.GetDatabase(databaseName);
        postsCollection = database.GetCollection<Posts>(collectionName);
    }

    public async Task<List<PostsDto>> PesquisarTodosPosts()
    {
        List<PostsDto> retorno = new List<PostsDto>();
        List<Posts> listaPosts = await postsCollection.Find(_ => true).ToListAsync();
        foreach(Posts post in listaPosts){
            retorno.Add(ConverterPostEntidade(post));
        }
            
        return retorno;
    }

    public async Task<PostsDto> PesquisarPostPorId(string id)
    {
       
        // if (string.IsNullOrWhiteSpace(id))
        //     throw new ArgumentException("O ID do post não pode ser nulo ou vazio.");

        var filtro = Builders<Posts>.Filter.Eq(post => post.Id, id);

        var post = await postsCollection.Find(filtro).FirstOrDefaultAsync();

        if (post == null)
            return null;

        return ConverterPostEntidade(post);
    }

    public async Task<RetornoAcaoDto> PumpPost(PostsDto postsDto)
    {
         RetornoAcaoDto retorno = new RetornoAcaoDto();

        // if (string.IsNullOrWhiteSpace(postsDto.Id))
        //     throw new ArgumentException("O ID do post não pode ser nulo ou vazio.");

        PostsDto postagem = await PesquisarPostPorId(postsDto.Id);

        if (postagem == null)
            throw new Exception("Post não encontrado.");

        // Incrementa o número de curtidas
        int numeroCurtidas = Convert.ToInt32(postagem.QtdCurtidas) + 1;
        postagem.QtdCurtidas = numeroCurtidas.ToString();

        // Cria o filtro para localizar o post no banco de dados
        var filter = Builders<Posts>.Filter.Eq(p => p.Id, postsDto.Id);

        // Cria o update para modificar o número de curtidas
        var update = Builders<Posts>.Update.Set(p => p.QtdCurtidas, postagem.QtdCurtidas);

        // Executa a atualização no MongoDB
        var result = await postsCollection.UpdateOneAsync(filter, update);

        // Verifica se a atualização foi realizada
        if (result.ModifiedCount > 0)
        {
            retorno.Mensagem = "Você deu um pump com sucesso!";
            retorno.Sucesso = true;
        }
        else
        {
            retorno.Mensagem = "Falha ao dar um pump neste post...";
            retorno.Sucesso = false;
        }

        return retorno;
    }

    public async Task<RetornoAcaoDto> RetirarPumpPost(PostsDto postsDto)
    {
         RetornoAcaoDto retorno = new RetornoAcaoDto();

        // if (string.IsNullOrWhiteSpace(postsDto.Id))
        //     throw new ArgumentException("O ID do post não pode ser nulo ou vazio.");

        PostsDto postagem = await PesquisarPostPorId(postsDto.Id);

        if (postagem == null)
            throw new Exception("Post não encontrado.");

        // Incrementa o número de curtidas
        int numeroCurtidas = Convert.ToInt32(postagem.QtdCurtidas) - 1;
        postagem.QtdCurtidas = numeroCurtidas.ToString();

        // Cria o filtro para localizar o post no banco de dados
        var filter = Builders<Posts>.Filter.Eq(p => p.Id, postsDto.Id);

        // Cria o update para modificar o número de curtidas
        var update = Builders<Posts>.Update.Set(p => p.QtdCurtidas, postagem.QtdCurtidas);

        // Executa a atualização no MongoDB
        var result = await postsCollection.UpdateOneAsync(filter, update);

        // Verifica se a atualização foi realizada
        if (result.ModifiedCount > 0)
        {
            retorno.Mensagem = "Você deu um pump com sucesso!";
            retorno.Sucesso = true;
        }
        else
        {
            retorno.Mensagem = "Falha ao dar um pump neste post...";
            retorno.Sucesso = false;
        }

        return retorno;
    }

    public async Task<RetornoAcaoDto> CriarPost(PostsDto postsDto)
    {
        RetornoAcaoDto retorno = new RetornoAcaoDto();
        try
        {
            Posts post = ConverterPostDto(postsDto);
            post.QtdCurtidas = "0";
            post.QtdImpulsionamentos = "0";


            await postsCollection.InsertOneAsync(post);
            retorno.Mensagem = "Post inserido com sucesso!";
            retorno.Sucesso = true;
        }
        catch (Exception ex)
        {
            retorno.Mensagem = $"Falha ao criar o post: {ex.Message}";
            retorno.Sucesso = false;
        }
        return retorno;
    }

    public Posts ConverterPostDto(PostsDto postDto)
    {
        Posts entidade = new Posts();
       
        entidade.Id = postDto.Id;
        entidade.IdUsuario = postDto.IdUsuario;
        entidade.Descricao = postDto.Descricao;
        entidade.QtdCurtidas = postDto.QtdCurtidas;
        entidade.QtdImpulsionamentos = postDto.QtdImpulsionamentos;
        entidade.FotoAnexo = postDto.FotoAnexo;

        return entidade;
    }

    public PostsDto ConverterPostEntidade(Posts entidade)
    {
        PostsDto dto = new PostsDto();
       
        dto.Id = entidade.Id;
        dto.IdUsuario = entidade.IdUsuario;
        dto.Descricao = entidade.Descricao;
        dto.QtdCurtidas = entidade.QtdCurtidas;
        dto.QtdImpulsionamentos = entidade.QtdImpulsionamentos;
        dto.FotoAnexo = entidade.FotoAnexo;

        return dto;
    }
}
