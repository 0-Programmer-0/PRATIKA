using System.Security;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text;
using System.Runtime.InteropServices;
using Microsoft.AspNetCore.Routing.Template;

namespace PBL_EC8.Bll;

public class ComunidadeBll : IComunidadeBll
{
    private readonly IMongoCollection<Posts> anunciosCollection;

    // Construtor que injeta a dependência de IMongoClient
    public ComunidadeBll(IMongoClient mongoClient, string databaseName, string collectionName)
    {
        var database = mongoClient.GetDatabase(databaseName);
        anunciosCollection = database.GetCollection<Posts>(collectionName);
    }

    public async Task<List<PostsDto>> PesquisarTodosPosts()
    {
        List<PostsDto> retorno = new List<PostsDto>();
        // List<Anuncio> listaAnuncio = await anunciosCollection.Find(_ => true).ToListAsync();
        // foreach(Anuncio anuncio in listaAnuncio)
        //     retorno.Add(ConverterAnuncio(anuncio));
        return retorno;
    }
}
