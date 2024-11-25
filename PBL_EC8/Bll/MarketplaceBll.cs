using System.Security;
using MongoDB.Driver;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text;
using System.Runtime.InteropServices;
using Microsoft.AspNetCore.Routing.Template;

namespace PBL_EC8.Bll;

public class MarketplaceBll : IMarketplaceBll
{
    private readonly IMongoCollection<Item> marketplaceCollection;

    // Construtor que injeta a dependência de IMongoClient
    public MarketplaceBll(IMongoClient mongoClient, string databaseName, string collectionName)
    {
        var database = mongoClient.GetDatabase(databaseName);
        marketplaceCollection = database.GetCollection<Item>(collectionName);
    }

    public async Task<RetornoAcaoDto> CriarItem(ItemDto itemDto)
    {
        RetornoAcaoDto retorno = new RetornoAcaoDto();
        try
        {
            Item item = new Item();
            item = ConverterItemDto(itemDto);
            await marketplaceCollection.InsertOneAsync(item);
            retorno.Mensagem = "Item inserido com sucesso!";
            retorno.Sucesso = true;
            return retorno;
        }
        catch (Exception ex)
        {
            retorno.Mensagem = "Falha ao criar o item na base...";
            retorno.Sucesso = false;
        }
        return retorno;
    }

    public async Task<List<ItemDto>> PesquisarTodosItens()
    {
        List<ItemDto> retorno = new List<ItemDto>();
        List<Item> listaItem = await marketplaceCollection.Find(_ => true).ToListAsync();
        foreach (Item item in listaItem)
            retorno.Add(ConverterItem(item));
        return retorno;
    }

    public async Task<List<ItemDto>> PesquisarItens(string pesquisa)
    {
        List<ItemDto> retorno = new List<ItemDto>();
        var filtro = Builders<Item>.Filter.Or
                        (
                            Builders<Item>.Filter.Regex(u => u.Titulo, new MongoDB.Bson.BsonRegularExpression(pesquisa, "i")),
                            Builders<Item>.Filter.Regex(u => u.Descricao, new MongoDB.Bson.BsonRegularExpression(pesquisa, "i")),
                            Builders<Item>.Filter.Regex(u => u.Valor, new MongoDB.Bson.BsonRegularExpression(pesquisa, "i")),
                            Builders<Item>.Filter.Regex(u => u.MetodoPagamento, new MongoDB.Bson.BsonRegularExpression(pesquisa, "i"))
                        );
        List<Item> listaItem = await marketplaceCollection.Find(filtro).ToListAsync();
        foreach (Item item in listaItem)
            retorno.Add(ConverterItem(item));
        return retorno;
    }

    private Item ConverterItemDto(ItemDto itemDto)
    {
        Item item = new Item();

        item.Titulo = itemDto.Titulo;
        item.IdUsuario = itemDto.IdUsuario;
        item.Descricao = itemDto.Descricao;
        item.Valor = itemDto.Valor;
        item.ImagemItem = itemDto.ImagemItem;
        item.Contato = itemDto.Contato;
        item.Quantidade = itemDto.Quantidade;
        item.MetodoPagamento = itemDto.MetodoPagamento;

        return item;
    }

    private ItemDto ConverterItem(Item item)
    {
        ItemDto itemDto = new ItemDto();

        itemDto.Id = item.Id;
        itemDto.Titulo = item.Titulo;
        itemDto.IdUsuario = item.IdUsuario;
        itemDto.Descricao = item.Descricao;
        itemDto.Valor = item.Valor;
        itemDto.ImagemItem = item.ImagemItem;
        itemDto.Contato = item.Contato;
        itemDto.Quantidade = item.Quantidade;
        itemDto.MetodoPagamento = item.MetodoPagamento;

        return itemDto;
    }
}