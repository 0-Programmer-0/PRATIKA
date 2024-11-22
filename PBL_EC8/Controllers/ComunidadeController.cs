using MongoDB.Driver;
using Microsoft.AspNetCore.Mvc;
using PBL_EC8.Bll;
using System.Diagnostics;
using Pbl_EC8.Models;

namespace PBL_EC8.Controllers;

public class ComunidadeController: Controller
{
    private readonly ILogger<ComunidadeController> _logger;
    private readonly ComunidadeBll comunidadeBll;
    private readonly UsuarioBll usuarioBll;
    private readonly CurtidaBll curtidaBll;


    public ComunidadeController(ILogger<ComunidadeController> logger, ComunidadeBll _comunidadeBll, UsuarioBll _usuarioBll, CurtidaBll _curtidaBll)
    {
        _logger = logger;
        usuarioBll = _usuarioBll;
        comunidadeBll = _comunidadeBll;
        curtidaBll = _curtidaBll;
    }

    public async Task<JsonResult> GetUsuarioLogado()
    {
        UsuarioDto u = new UsuarioDto();
        u.NomeUsuario = HttpContext.Session.GetString("Usuario");
        u = await usuarioBll.PesquisarUsuario(u);
        return Json(u);

    }

    public IActionResult ComunidadeIndex()
    {

        return View();
    }

    [HttpPost]
    public IActionResult ShowModalContent()
    {
        return PartialView("_NovaPostagem");
    }

    [HttpPost]
    public async Task<JsonResult> ListarPosts()
    {
        try
        {
            var posts = await comunidadeBll.PesquisarTodosPosts();
            return Json(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError("Erro ao listar posts: {Message}", ex.Message);
            return Json(new { success = false, message = "Erro ao listar posts." });
        }
    }

    [HttpPost]
    public async Task<JsonResult> DarPumpPost(PostsDto postsDto)
    {
        UsuarioDto usuarioDto = new UsuarioDto();
        CurtidaDto curtidaDto = new CurtidaDto();

        if (postsDto == null)
        {
            throw new ArgumentNullException(nameof(postsDto), "O objeto postsDto ou seu ID é nulo.");
        }
        
        usuarioDto.NomeUsuario = HttpContext.Session.GetString("Usuario");
        usuarioDto = await usuarioBll.PesquisarUsuario(usuarioDto);

        curtidaDto.IdUsuario = usuarioDto.Id;
        curtidaDto.IdPost = postsDto.Id;
        
        try
        {
            await curtidaBll.CriarCurtida(curtidaDto);
            var posts = await comunidadeBll.PumpPost(postsDto);
            return Json(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError("Erro ao dar pump no posts: {Message}", ex.Message);
            return Json(new { success = false, message = "Erro ao dar um pump no posts." });
        }
    }

    [HttpPost]
    public async Task<JsonResult> RetirarPumpPost(PostsDto postsDto)
    {
        UsuarioDto usuarioDto = new UsuarioDto();
        CurtidaDto curtidaDto = new CurtidaDto();
       
        if (postsDto == null)
        {
            throw new ArgumentNullException(nameof(postsDto), "O objeto postsDto ou seu ID é nulo.");
        }

        usuarioDto.NomeUsuario = HttpContext.Session.GetString("Usuario");
        usuarioDto = await usuarioBll.PesquisarUsuario(usuarioDto);

        var curtidas = await curtidaBll.BuscarCurtidas();
        curtidaDto.IdUsuario = usuarioDto.Id;
        curtidaDto.IdPost = postsDto.Id;

        foreach(var curtida in curtidas){
            if(curtida.IdPost == curtidaDto.IdPost && curtida.IdUsuario == curtidaDto.IdUsuario ){
                curtidaDto.Id = curtida.Id;
            }
        }

        try
        {
            await curtidaBll.RetirarCurtida(curtidaDto);
            var posts = await comunidadeBll.RetirarPumpPost(postsDto);
            return Json(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError("Erro ao dar pump no posts: {Message}", ex.Message);
            return Json(new { success = false, message = "Erro ao dar um pump no posts." });
        }
    }

     [HttpPost]
    public async Task<JsonResult> ImpulsionarPost(PostsDto postsDto)
    {
        if (postsDto == null)
        {
            throw new ArgumentNullException(nameof(postsDto), "O objeto postsDto ou seu ID é nulo.");
        }

        try
        {
            var posts = await comunidadeBll.ImpulsionarPost(postsDto);
            return Json(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError("Erro ao dar pump no posts: {Message}", ex.Message);
            return Json(new { success = false, message = "Erro ao impulsionar posts." });
        }
    }

    [HttpPost]
    public async Task<JsonResult> RetiraImpulsionarPost(PostsDto postsDto)
    {
        if (postsDto == null)
        {
            throw new ArgumentNullException(nameof(postsDto), "O objeto postsDto ou seu ID é nulo.");
        }

        try
        {
            var posts = await comunidadeBll.RetiraImpulsionarPost(postsDto);
            return Json(posts);
        }
        catch (Exception ex)
        {
            _logger.LogError("Erro ao dar pump no posts: {Message}", ex.Message);
            return Json(new { success = false, message = "Erro ao dar um pump no posts." });
        }
    }


    [HttpPost]
    public async Task<JsonResult> CadastrarPost(PostsDto dto)
    {
        try
        {
            var usuarioNome = HttpContext.Session.GetString("Usuario");
            if (string.IsNullOrEmpty(usuarioNome))
            {
                return Json(new { success = false, message = "Usuário não autenticado." });
            }

            var usuarioDto = await usuarioBll.PesquisarUsuario(new UsuarioDto { NomeUsuario = usuarioNome });
            if (usuarioDto == null)
            {
                return Json(new { success = false, message = "Usuário não encontrado." });
            }

            dto.IdUsuario = usuarioDto.Id;
            var retorno = await comunidadeBll.CriarPost(dto);

            return Json(new { success = retorno.Sucesso, message = retorno.Mensagem });
        }
        catch (Exception ex)
        {
            _logger.LogError("Erro ao cadastrar post: {Message}", ex.Message);
            return Json(new { success = false, message = "Erro ao cadastrar post." });
        }
    }

    [HttpPost]
    public async Task<JsonResult> BuscarCurtidas()
    {
        try
        {
            var curtidas = await curtidaBll.BuscarCurtidas();
            return Json(curtidas);
        }
        catch (Exception ex)
        {
            _logger.LogError("Erro ao listar curtidas: {Message}", ex.Message);
            return Json(new { success = false, message = "Erro ao listar curtidas." });
        }
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error() => View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
}
