using MongoDB.Driver;
using Microsoft.Extensions.Options;
using PBL_EC8.Bll; // Para usar IOptions

var builder = WebApplication.CreateBuilder(args);

// Registrar o MongoClient
builder.Services.AddSingleton<IMongoClient, MongoClient>(sp =>
{
    var connectionString = builder.Configuration["MongoDBSettings:ConnectionString"];
    return new MongoClient(connectionString);
});

// Registrar o UsuarioBll
builder.Services.AddScoped<UsuarioBll>(sp =>
{
    var mongoClient = sp.GetRequiredService<IMongoClient>();
    var databaseName = builder.Configuration["MongoDBSettings:DatabaseName"] ?? "db_pratika"; // Pega o nome do banco de dados
    var collectionName = "collection_usuarios";  // Nome da coleção
    return new UsuarioBll(mongoClient, databaseName, collectionName);
});

// Registrar controllers com views
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

// Configurar rotas padrão
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Menu}/{id?}");

app.Run();
