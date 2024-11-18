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
        foreach(Posts post in listaPosts)
            retorno.Add(ConverterPostEntidade(post));
        return retorno;
    }

    public async Task<RetornoAcaoDto> CriarPost(PostsDto postsDto)
    {
        Console.WriteLine(postsDto);
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
       
        dto.IdUsuario = entidade.IdUsuario;
        dto.Descricao = entidade.Descricao;
        dto.QtdCurtidas = entidade.QtdCurtidas;
        dto.QtdImpulsionamentos = entidade.QtdImpulsionamentos;
        dto.FotoAnexo = entidade.FotoAnexo;

        return dto;
    }
}
