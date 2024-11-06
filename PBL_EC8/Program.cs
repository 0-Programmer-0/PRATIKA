using MongoDB.Driver;
using Microsoft.Extensions.Options;
using PBL_EC8.Bll; // Para usar IOptions

var builder = WebApplication.CreateBuilder(args);

// builder.WebHost.ConfigureKestrel(options =>
// {
//     options.ListenAnyIP(5020); // Escuta em todas as interfaces na porta 5020
// });

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenLocalhost(5014); // HTTP
    options.ListenLocalhost(7282, listenOptions => listenOptions.UseHttps()); // HTTPS
});

// Registrar o MongoClient
builder.Services.AddSingleton<IMongoClient, MongoClient>(sp =>
{
    //Configuração antiga
    // var connectionString = builder.Configuration["MongoDBSettings:ConnectionString"];
    // return new MongoClient(connectionString);

    //Configuração nova - aumento de tempo de requisão, devido a casos de internet lenta
    var settings = MongoClientSettings.FromConnectionString(builder.Configuration["MongoDBSettings:ConnectionString"]);
    settings.ConnectTimeout = TimeSpan.FromSeconds(60); // Ajusta para o tempo desejado
    settings.SocketTimeout = TimeSpan.FromSeconds(60);
    settings.UseTls = true; // Habilita SSL/TLS
    var client = new MongoClient(settings);
    return client;
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

// Adicionar a utilização de Session
builder.Services.AddSession();

var app = builder.Build();

// Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

//app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

// Utilizar Session
app.UseSession();

// Configurar rotas padrão
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Menu}/{id?}");

app.Run();
