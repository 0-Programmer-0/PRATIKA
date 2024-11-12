using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Posts
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("Titulo")]
    public string Titulo { get; set; }

    [BsonElement("IdUsuario")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string IdUsuario { get; set; }

    [BsonElement("Profissao")]
    public string Profissao { get; set; }

    [BsonElement("Estado")]
    public string Estado { get; set; }

    [BsonElement("Cidade")]
    public string Cidade { get; set; }

    [BsonElement("Descricao")]
    public string Descricao { get; set; }
}
